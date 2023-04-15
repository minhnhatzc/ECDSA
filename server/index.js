const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "048fc7df361a8fcfeed8dd5e0608edadfed2a4c41d28c592fb7004f91b3cf80e293fa1aff84ec7253f203fde494be595e2f0460b11858c8f84260c4069d261b500": 100,
  "04c559ca0658c0e061cb08484484fa4e05577f60983ff4c9822790062ac992a42fc8fe0e148a6a61be310b9b08be9428f6223edc4a769f9dd4a5b0b4495066e45a": 566660,
  "048a87e1092dedaafbf623b4ece7947bb0a1a0b8391f3865b4735fbc459dc0a53baad56090b133c878921d9bd05e89304cd7424eb2f5aa92549db7d5f17de65a38": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
