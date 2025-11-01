import { Request, Response, NextFunction } from 'express';
import Table from '../models/Table';

export const getTableByQr = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tableNumber = req.params.tableNumber;
    if (!tableNumber) {
      res.status(400).json({ status: 'fail', message: 'Table number is required' });
      return;
    }
    const table = await Table.findOne({ number: parseInt(tableNumber, 10) });
    if (!table) {
      res.status(404).json({ status: 'fail', message: 'Table not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: { table } });
  } catch (err) { next(err); }
};

export const getAllTables = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.status(200).json({ status: 'success', results: tables.length, data: { tables } });
  } catch (err) { next(err); }
};

export const getTableById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      res.status(404).json({ status: 'fail', message: 'Table not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: { table } });
  } catch (err) { next(err); }
};

export const createTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json({ status: 'success', data: { table } });
  } catch (err) { next(err); }
};

export const updateTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!table) {
      res.status(404).json({ status: 'fail', message: 'Table not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: { table } });
  } catch (err) { next(err); }
};

export const deleteTable = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success' });
  } catch (err) { next(err); }
};

export const generateQrForTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      res.status(404).json({ status: 'fail', message: 'Table not found' });
      return;
    }
    // Stub: In real impl, generate and store QR
    table.qrCode = `TABLE-${table.number}`;
    await table.save();
    res.status(200).json({ status: 'success', data: { table } });
  } catch (err) { next(err); }
};

export const updateTableStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      res.status(404).json({ status: 'fail', message: 'Table not found' });
      return;
    }
    table.status = req.body.status;
    await table.save();
    res.status(200).json({ status: 'success', data: { table } });
  } catch (err) { next(err); }
};


