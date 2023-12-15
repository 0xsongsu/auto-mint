import React, { useState } from 'react';
import { ethers } from 'ethers';
import './TransactionSender.css';

const TransactionSender = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [hexData, setHexData] = useState('');
  const [repeatCount, setRepeatCount] = useState(1);
  const [logs, setLogs] = useState([]);
  const [isSelfTransfer, setIsSelfTransfer] = useState(false); // 正确的位置
  const [toAddress, setToAddress] = useState(''); // 为用户手动输入的地址增加状态
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    let newErrors = {};
    if (!privateKey) newErrors.privateKey = "未填写私钥";
    if (!rpcUrl) newErrors.rpcUrl = "未填写RPC链接";
    if (!hexData) newErrors.hexData = "未填写16进制数据";
    if (!repeatCount || repeatCount < 1) newErrors.repeatCount = "未填写交易次数";
    if (!isSelfTransfer && !toAddress) newErrors.toAddress = "未填写转账地址";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addLog = (message, type = 'info') => {
    setLogs((prevLogs) => [...prevLogs, { message, type }]);
  };

  const handleSendTransactions = async () => {
    if (!validateInputs()) {
      addLog('验证失败，请检查输入。', 'error');
      return;
    }

    try {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const wallet = new ethers.Wallet(privateKey, provider);
      const targetAddress = isSelfTransfer ? wallet.address : toAddress;

      const nonce = await wallet.getTransactionCount("pending");

      for (let i = 0; i < repeatCount; i++) {
        const gasPrice = await provider.getGasPrice();
        const gasLimit = await provider.estimateGas({
          to: targetAddress,
          data: hexData,
          value: ethers.utils.parseEther("0"),
        });

        const transaction = {
          to: targetAddress,
          value: ethers.utils.parseEther("0"),
          nonce: nonce + i,
          data: hexData,
          gasPrice: gasPrice.mul(100).div(100),
          gasLimit: gasLimit,
        };

        const tx = await wallet.sendTransaction(transaction);
        addLog(`交易序号 ${nonce + i} 的交易哈希：${tx.hash}`);
      }
    } catch (error) {
      addLog(`交易过程中出错：${error.message}`, 'error');
    }
  };
  

  return (
    <div className="container">
      <h1>Transaction Sender</h1>
      <div className="form-group">
        <label>Private Key</label>
        <input className="form-control" type="text" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="输入你的钱包私钥" />
      </div>
      <div className="form-group">
        <label>RPC URL</label>
        <input className="form-control" type="text" value={rpcUrl} onChange={(e) => setRpcUrl(e.target.value)} placeholder="输入RPC链接" />
      </div>
      <div className="form-group">
        <label>Hex Data</label>
        <input className="form-control" type="text" value={hexData} onChange={(e) => setHexData(e.target.value)} placeholder="输入16进制数据" />
      </div>
      <div className="form-group switch-container">
        <label>自转开关（关闭可自定义转账地址）</label>
        <label className="switch">
          <input type="checkbox" checked={isSelfTransfer} onChange={(e) => setIsSelfTransfer(e.target.checked)} />
          <span className="slider round"></span>
        </label>
      </div>
      {!isSelfTransfer && (
        <div className="form-group">
          <label>To Address</label>
          <input className="form-control" type="text" value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="输入转账地址" />
        </div>
      )}
      <div className="form-group">
        <label>交易次数</label>
        <input className="form-control" type="number" value={repeatCount} onChange={(e) => setRepeatCount(e.target.value)} placeholder="输入交易次数" />
      </div>

      <div className="container">
      {/* ...[已有的输入元素] */}
      {Object.keys(errors).map(key => (
        <div key={key} className="error">{errors[key]}</div>
      ))}
      <button className="btn" onClick={handleSendTransactions}>发送交易</button>
      </div>
      <div className="logs">
        <h3>Transaction Logs</h3>
        {logs.map((log, index) => (
          <div key={index} className={`log ${log.type}`}>{log.message}</div>
        ))}
      </div>
    </div>
  );
};

export default TransactionSender;