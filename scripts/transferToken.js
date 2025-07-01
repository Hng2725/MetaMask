require("dotenv").config({ path: "../.env" });
const { Web3 } = require("web3");

const web3 = new Web3(process.env.ARBITRUM_SEPOLIA_RPC_URL);

// Địa chỉ và khóa riêng
const senderPrivateKey = process.env.PRIVATE_KEY;
console.log("PRIVATE_KEY from env:", senderPrivateKey);
console.log("Type of PRIVATE_KEY:", typeof senderPrivateKey);

if (!senderPrivateKey) {
  console.error("PRIVATE_KEY is not set in environment variables");
  process.exit(1);
}

const senderAddress =
  web3.eth.accounts.privateKeyToAccount(senderPrivateKey).address;

const receiverAddress = "0xb128B78b8F075f0e7c70e74209270Bc173F7dEF5";
const tokenAddress = "0xFEE753b2a49e686c18E7183a356011c964f3A750";

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

    // Chuyển đổi số lượng token sang wei
    const amountInWei = web3.utils.toWei(amount.toString(), "ether");

    const nonce = await web3.eth.getTransactionCount(senderAddress, "latest");
    const gasPrice = await web3.eth.getGasPrice();

    const data = tokenContract.methods
      .transfer(receiverAddress, amountInWei)
      .encodeABI();
    const gas = await tokenContract.methods
      .transfer(receiverAddress, amountInWei)
      .estimateGas({ from: senderAddress });

    const tx = {
      from: senderAddress,
      to: tokenAddress,
      nonce: nonce,
      gasPrice: gasPrice,
      data: data,
      gasLimit: gas,
    };

    console.log("TX:", tx);

    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      senderPrivateKey
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );

    console.log("Token sent! hash:", receipt.transactionHash);
  } catch (err) {
    console.error("Error sending token:", err.message || err);
  }
}

transferToken(10); // Chuyển 10 token
