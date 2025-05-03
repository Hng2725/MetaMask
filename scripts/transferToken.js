require("dotenv").config();
const { Web3 } = require("web3");

//Dùng endpoint Arbitrum Sepolia
const web3 = new Web3("https://sepolia-rollup.arbitrum.io/rpc");

const senderPrivateKey = process.env.PRIVATE_KEY;
const senderAddress = "0x6Ac1314fF3ddF9D94F2c4393b6E0eE1Cd246A7C4";
const receiverAddress = "0xb128B78b8F075f0e7c70e74209270Bc173F7dEF5";
const tokenAddress = "0x97FB6Dc89E80a3e8C7A690Fe0a298CAC5e0550cA";

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
  try {
    const tokenContract = new web3.eth.Contract(abi, tokenAddress);
    const amountInWei = web3.utils.toWei(amount.toString(), "ether");
    const data = tokenContract.methods
      .transfer(receiverAddress, amountInWei)
      .encodeABI();

    const nonce = await web3.eth.getTransactionCount(senderAddress, "latest");
    const gas = await tokenContract.methods
      .transfer(receiverAddress, amountInWei)
      .estimateGas({ from: senderAddress });

    const gasPrice = await web3.eth.getGasPrice();

    const tx = {
      from: senderAddress,
      to: tokenAddress,
      nonce: nonce,
      gas: gas,
      gasPrice: gasPrice,
      data: data,
    };

    // Ký giao dịch
    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      senderPrivateKey
    );

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log("Thành công:", receipt.transactionHash);
  } catch (err) {
    console.error("Error:", err.message || err);
  }
}

transferToken(10); // Chuyển 10 token
