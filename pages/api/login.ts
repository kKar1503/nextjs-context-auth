import type { NextApiRequest, NextApiResponse } from 'next';
import type { User, LoginParam, Error, UserWithToken } from '../../types';

const accounts: User[] = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
  },
  {
    username: 'joe',
    password: 'joemama',
    role: 'user',
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserWithToken | Error>
) {
  const { username, password } = req.body as LoginParam;
  const user = accounts.find(
    (account) => account.username === username && account.password === password
  );
  if (user === undefined) res.status(401).json({ error: 'No account found' });
  else res.status(200).json({ ...user, token: 'mySpecialToken' });
}
