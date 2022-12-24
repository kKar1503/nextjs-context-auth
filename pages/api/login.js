const accounts = [
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

export default function handler(req, res) {
  const { username, password } = req.body;
  const user = accounts.find(
    (account) => account.username === username && account.password === password
  );
  if (user === undefined) res.status(401).json({ error: 'No account found' });
  else res.status(200).json({ ...user, token: 'mySpecialToken' });
}
