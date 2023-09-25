import express from 'express';
import path from 'path';
const app = express();

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, 'frontend/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(_dirname, 'frontend/build/index.htlm'))
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
