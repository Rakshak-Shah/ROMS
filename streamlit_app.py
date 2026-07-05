"""
ROMS Demo — Streamlit interface for the Restaurant Order Management System.
Connects to the Express backend API at http://localhost:4000
"""

import json
from datetime import date, time

import requests
import streamlit as st

API_BASE = "http://localhost:4000"

# Sample menu used when backend is offline (matches ROMS seed data shape)
DEMO_MENU = [
    {"_id": "demo1", "name": "Chicken Momo", "price": 250, "category": "appetizers",
     "description": "Steamed dumplings with spicy chutney"},
    {"_id": "demo2", "name": "Dal Bhat", "price": 350, "category": "mains",
     "description": "Traditional Nepali lentil soup with rice"},
    {"_id": "demo3", "name": "Margherita Pizza", "price": 450, "category": "mains",
     "description": "Fresh mozzarella, tomato, basil"},
    {"_id": "demo4", "name": "Chocolate Lava Cake", "price": 280, "category": "desserts",
     "description": "Warm chocolate cake with molten center"},
    {"_id": "demo5", "name": "Mango Lassi", "price": 150, "category": "beverages",
     "description": "Creamy mango yogurt drink"},
    {"_id": "demo6", "name": "Garlic Naan", "price": 120, "category": "appetizers",
     "description": "Soft bread with garlic butter"},
]

st.set_page_config(
    page_title="ROMS — Delicious Restaurant",
    page_icon="🍽️",
    layout="wide",
    initial_sidebar_state="expanded",
)


# ── Helpers ──────────────────────────────────────────────────────────────────

def api_get(path: str, token: str | None = None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    r = requests.get(f"{API_BASE}{path}", headers=headers, timeout=10)
    r.raise_for_status()
    return r.json()


def api_post(path: str, data: dict, token: str | None = None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    r = requests.post(f"{API_BASE}{path}", json=data, headers=headers, timeout=10)
    r.raise_for_status()
    return r.json()


def backend_ok() -> bool:
    try:
        r = requests.get(f"{API_BASE}/health", timeout=5)
        return r.status_code == 200
    except Exception:
        return False


def extract_menu_items(response: dict) -> list:
    if response.get("data", {}).get("menuItems"):
        return response["data"]["menuItems"]
    if response.get("menuItems"):
        return response["menuItems"]
    if isinstance(response.get("data"), list):
        return response["data"]
    return []


def init_session():
    defaults = {
        "token": None,
        "user": None,
        "cart": [],
        "table_number": None,
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v


init_session()


# ── Sidebar ──────────────────────────────────────────────────────────────────

with st.sidebar:
    st.title("🍽️ ROMS Demo")
    st.caption("Restaurant Order Management System")

    demo_mode = not backend_ok()
    if demo_mode:
        st.warning("⚠️ Demo mode (backend offline)")
        st.caption("Using sample data. Start backend for live API.")
    else:
        st.success("✅ Backend connected")
        st.caption("Live data from Express + MongoDB")

    st.divider()
    page = st.radio(
        "Navigate",
        ["🏠 Overview", "📋 Menu & Order", "📅 Reservations", "🔐 Login / Admin"],
        label_visibility="collapsed",
    )

    if st.session_state.user:
        st.divider()
        st.write(f"**Logged in:** {st.session_state.user.get('name', 'User')}")
        st.write(f"Role: `{st.session_state.user.get('role', 'customer')}`")
        if st.button("Logout"):
            st.session_state.token = None
            st.session_state.user = None
            st.rerun()

    st.divider()
    table = st.number_input("Table # (dine-in)", min_value=0, max_value=50, value=0, step=1)
    st.session_state.table_number = table if table > 0 else None


# ── Pages ────────────────────────────────────────────────────────────────────

if page == "🏠 Overview":
    st.title("Delicious Restaurant — ROMS")
    st.markdown(
        """
        This **Streamlit demo** shows how your ROMS project works by calling the same
        **Express + MongoDB** backend that powers the Next.js frontend.

        ### Architecture
        ```
        Streamlit UI  ──►  Express API (port 4000)  ──►  MongoDB Atlas
        Next.js UI    ──►  Express API (port 4000)  ──►  MongoDB Atlas
        ```

        ### What ROMS does
        | Feature | Description |
        |---------|-------------|
        | **Menu** | Browse categories, prices, add to cart |
        | **Orders** | Dine-in (QR/table), delivery, pickup |
        | **Reservations** | Book tables by date & time |
        | **Reviews** | Customer ratings |
        | **Admin** | Dashboard, orders, inventory, QR codes |

        ### Full web app
        Run the native Next.js frontend separately:
        ```bash
        npm run dev   # → http://localhost:3000
        ```
        """
    )

    if backend_ok():
        try:
            health = api_get("/health")
            col1, col2, col3 = st.columns(3)
            col1.metric("API Status", health.get("status", "—"))
            col2.metric("Uptime (s)", f"{health.get('uptime', 0):.0f}")
            col3.metric("Environment", health.get("environment", "dev") or "development")
        except Exception as e:
            st.warning(f"Health check failed: {e}")

elif page == "📋 Menu & Order":
    st.title("📋 Menu & Order")

    live = backend_ok()
    if live:
        try:
            raw = api_get("/api/menu")
            items = extract_menu_items(raw)
        except Exception as e:
            st.error(f"Could not load menu: {e}")
            items = DEMO_MENU
            st.info("Falling back to demo menu.")
    else:
        items = DEMO_MENU
        st.info("**Demo mode** — showing sample menu. Connect backend for real data.")

    categories = sorted({i.get("category", "other") for i in items})
    cat_filter = st.selectbox("Category", ["All"] + categories)

    filtered = items if cat_filter == "All" else [i for i in items if i.get("category") == cat_filter]

    st.subheader(f"{len(filtered)} items")
    cols = st.columns(3)
    for idx, item in enumerate(filtered):
        with cols[idx % 3]:
            with st.container(border=True):
                st.markdown(f"**{item.get('name', 'Item')}**")
                st.caption(item.get("description", "")[:80])
                price = item.get("specialPrice") or item.get("price", 0)
                st.markdown(f"**Rs. {price:.0f}** · `{item.get('category', '')}`")
                qty = st.number_input("Qty", min_value=1, max_value=10, value=1, key=f"qty_{item['_id']}")
                if st.button("Add to cart", key=f"add_{item['_id']}"):
                    st.session_state.cart.append({
                        "menuItem": item["_id"],
                        "name": item["name"],
                        "price": price,
                        "quantity": qty,
                        "subtotal": price * qty,
                    })
                    st.toast(f"Added {item['name']}")

    # Cart
    st.divider()
    st.subheader("🛒 Cart")
    if not st.session_state.cart:
        st.info("Cart is empty — add items above.")
    else:
        total = sum(i["subtotal"] for i in st.session_state.cart)
        for i, line in enumerate(st.session_state.cart):
            c1, c2 = st.columns([4, 1])
            c1.write(f"{line['name']} × {line['quantity']} = Rs. {line['subtotal']:.0f}")
            if c2.button("Remove", key=f"rm_{i}"):
                st.session_state.cart.pop(i)
                st.rerun()
        st.markdown(f"**Total: Rs. {total:.0f}**")

        order_type = st.radio("Order type", ["dine-in", "delivery", "pickup"], horizontal=True)
        payment = st.selectbox("Payment", ["cash", "online", "card"])

        if st.button("Place Order", type="primary"):
            if not live:
                st.success(f"Demo order placed! Total Rs. {total:.0f} ({order_type})")
                st.session_state.cart = []
                st.stop()
            payload = {
                "items": st.session_state.cart,
                "orderType": order_type,
                "paymentMethod": payment,
                "customerInfo": {
                    "name": st.session_state.user.get("name", "Guest") if st.session_state.user else "Guest",
                    "email": st.session_state.user.get("email", "guest@example.com") if st.session_state.user else "guest@example.com",
                    "phone": "9800000000",
                },
            }
            if order_type == "dine-in" and st.session_state.table_number:
                payload["tableNumber"] = st.session_state.table_number

            try:
                headers = {}
                if st.session_state.token:
                    headers["Authorization"] = f"Bearer {st.session_state.token}"
                r = requests.post(
                    f"{API_BASE}/api/orders",
                    json=payload,
                    headers={**headers, "Content-Type": "application/json"},
                    timeout=15,
                )
                if r.ok:
                    result = r.json()
                    order = result.get("data", {}).get("order") or result.get("order", result)
                    st.success(f"Order placed! #{order.get('orderNumber', order.get('_id', 'OK'))}")
                    st.session_state.cart = []
                    st.json(order)
                else:
                    st.error(f"Order failed ({r.status_code}): {r.text}")
            except Exception as e:
                st.error(f"Order error: {e}")

elif page == "📅 Reservations":
    st.title("📅 Table Reservation")

    live = backend_ok()

    with st.form("reservation_form"):
        name = st.text_input("Name", value=st.session_state.user.get("name", "") if st.session_state.user else "")
        email = st.text_input("Email", value=st.session_state.user.get("email", "") if st.session_state.user else "")
        phone = st.text_input("Phone", value="9800000000")
        res_date = st.date_input("Date", value=date.today())
        res_time = st.time_input("Time", value=time(19, 0))
        guests = st.number_input("Guests", min_value=1, max_value=20, value=2)
        notes = st.text_area("Special requests")
        submitted = st.form_submit_button("Book Table", type="primary")

    if submitted:
        if not live:
            st.success(f"Demo reservation for {name} — {guests} guests on {res_date} at {res_time.strftime('%H:%M')}")
            st.stop()
        payload = {
            "customerName": name,
            "customerEmail": email,
            "customerPhone": phone,
            "date": res_date.isoformat(),
            "time": res_time.strftime("%H:%M"),
            "partySize": guests,
            "specialRequests": notes or None,
        }
        try:
            headers = {"Content-Type": "application/json"}
            if st.session_state.token:
                headers["Authorization"] = f"Bearer {st.session_state.token}"
            r = requests.post(f"{API_BASE}/api/reservations", json=payload, headers=headers, timeout=15)
            if r.ok:
                st.success("Reservation submitted!")
                st.json(r.json())
            else:
                st.error(f"Failed ({r.status_code}): {r.text}")
        except Exception as e:
            st.error(str(e))

elif page == "🔐 Login / Admin":
    st.title("🔐 Login & Admin Dashboard")

    live = backend_ok()

    if not st.session_state.user:
        st.subheader("Login")
        with st.form("login"):
            email = st.text_input("Email", value="admin@roms.com")
            password = st.text_input("Password", type="password", value="admin123")
            if st.form_submit_button("Login", type="primary"):
                if not live and email == "admin@roms.com" and password == "admin123":
                    st.session_state.user = {"name": "Admin User", "email": email, "role": "admin"}
                    st.session_state.token = "demo-token"
                    st.success("Demo login successful!")
                    st.rerun()
                try:
                    r = requests.post(
                        f"{API_BASE}/api/auth/login",
                        json={"email": email, "password": password},
                        timeout=10,
                    )
                    if r.ok:
                        data = r.json()
                        st.session_state.token = data.get("token") or data.get("data", {}).get("token")
                        st.session_state.user = data.get("user") or data.get("data", {}).get("user")
                        st.success(f"Welcome, {st.session_state.user.get('name', email)}!")
                        st.rerun()
                    else:
                        st.error(f"Login failed: {r.text}")
                except Exception as e:
                    st.error(str(e))
        st.info("Test credentials: `admin@roms.com` / `admin123`")
    else:
        user = st.session_state.user
        st.success(f"Logged in as **{user.get('name')}** ({user.get('role')})")
        token = st.session_state.token

        if user.get("role") in ("admin", "staff"):
            st.subheader("Admin Dashboard")
            if not live:
                c1, c2, c3, c4 = st.columns(4)
                c1.metric("Today's Orders", 12)
                c2.metric("Pending", 3)
                c3.metric("Reservations", 5)
                c4.metric("Revenue (Rs.)", "8,450")
                st.dataframe([
                    {"orderNumber": "ORD-001", "status": "preparing", "total": 850, "orderType": "dine-in"},
                    {"orderNumber": "ORD-002", "status": "pending", "total": 1200, "orderType": "delivery"},
                ], use_container_width=True)
                st.caption("Demo admin stats — connect backend for live dashboard.")
                st.stop()
            try:
                dash = api_get("/api/admin/dashboard", token)
                data = dash.get("data", dash)
                if isinstance(data, dict):
                    metrics = data.get("stats") or data
                    mcols = st.columns(4)
                    for i, (k, v) in enumerate(list(metrics.items())[:4]):
                        mcols[i % 4].metric(k.replace("_", " ").title(), v)
            except Exception as e:
                st.warning(f"Dashboard: {e}")

            tab1, tab2, tab3 = st.tabs(["Orders", "Reservations", "Menu (admin)"])

            with tab1:
                try:
                    orders_resp = api_get("/api/admin/orders", token)
                    orders = orders_resp.get("data", {}).get("orders", [])
                    if orders:
                        st.dataframe(
                            [{k: o.get(k) for k in ("orderNumber", "status", "total", "orderType", "createdAt")} for o in orders[:20]],
                            use_container_width=True,
                        )
                    else:
                        st.info("No orders yet.")
                except Exception as e:
                    st.error(str(e))

            with tab2:
                try:
                    res_resp = api_get("/api/admin/reservations", token)
                    reservations = res_resp.get("data", {}).get("reservations", [])
                    if reservations:
                        st.dataframe(
                            [{k: r.get(k) for k in ("customerName", "date", "time", "partySize", "status")} for r in reservations[:20]],
                            use_container_width=True,
                        )
                    else:
                        st.info("No reservations yet.")
                except Exception as e:
                    st.error(str(e))

            with tab3:
                try:
                    menu_resp = api_get("/api/admin/menu", token)
                    menu_items = menu_resp.get("data", {}).get("menuItems", [])
                    st.write(f"{len(menu_items)} menu items in database")
                    if menu_items:
                        st.dataframe(
                            [{k: m.get(k) for k in ("name", "category", "price", "isAvailable")} for m in menu_items[:15]],
                            use_container_width=True,
                        )
                except Exception as e:
                    st.error(str(e))
        else:
            st.info("Customer account — use Menu & Order to place orders.")
