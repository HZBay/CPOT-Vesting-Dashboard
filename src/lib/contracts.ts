export const contractConfig = {
  mainnet: {
    vestingAddress: "0x...",
    tokenAddress: "0x...",
    chainId: 1
  },
  testnet: {
    vestingAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Local anvil node
    tokenAddress: "0x...",
    chainId: 31337
  }
} as const;

export const vestingContractAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      }
    ],
    "name": "getBeneficiaryVestingSchedules",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "initialized",
            "type": "bool"
          },
          {
            "internalType": "address",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "cliff",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "start",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "duration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "slicePeriodSeconds",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "revocable",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "amountTotal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "released",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "revoked",
            "type": "bool"
          },
          {
            "internalType": "enum IVesting.AllocationCategory",
            "name": "category",
            "type": "uint8"
          },
          {
            "internalType": "enum IVesting.VestingType",
            "name": "vestingType",
            "type": "uint8"
          }
        ],
        "internalType": "struct IVesting.VestingSchedule[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      }
    ],
    "name": "getBeneficiaryVestingSummary",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "totalAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "releasedAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "releasableAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lockedAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "scheduleCount",
            "type": "uint256"
          }
        ],
        "internalType": "struct IVesting.BeneficiarySummary",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVestingSchedulesTotalAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVestingSchedulesReleasedAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "vestingScheduleId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "release",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "vestingScheduleId",
        "type": "bytes32"
      }
    ],
    "name": "computeReleasableAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
