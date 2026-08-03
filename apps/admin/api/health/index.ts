import { NextApiRequest, NextApiResponse } from 'next';

export default function health(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'OK', message: 'Admin panel is healthy' });
}