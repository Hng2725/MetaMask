require("dotenv").config();

const { Web3 } = require("web3");

const web3 = new Web3("https://1rpc.io/arb");

const senderPrivateKey = process.env.PRIVATE_KEY;
const senderAddress = "0x6Ac1314fF3ddF9D94F2c4393b6E0eE1Cd246A7C4"; // Địa chỉ ví người gửi
const receiverAddress = "0xb128B78b8F075f0e7c70e74209270Bc173F7dEF5"; // Địa chỉ ví người nhận
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Địa chỉ Token ERC20

const abi = [
  {
    constant: false,
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

async function transferToken(amount) {
  const tokenContract = new web3.eth.Contract(abi, tokenAddress);
  const amountInWei = web3.utils.toWei(amount.toString(), "ether");

  const tx = {
    from: senderAddress,
    to: tokenAddress,
    gas: 200000,
    data: tokenContract.methods
      .transfer(receiverAddress, amountInWei)
      .encodeABI(),
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    tx,
    senderPrivateKey
  );

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log("Transaction Hash:", receipt.transactionHash);
}

transferToken(10); // Chuyển 10 token
