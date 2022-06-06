import CollectionConfigInterface from '../lib/CollectionConfigInterface';
import { ethereumTestnet, ethereumMainnet } from '../lib/Networks';
import { openSea } from '../lib/Marketplaces';
import whitelistAddresses from './whitelist.json';

const CollectionConfig: CollectionConfigInterface = {
  testnet: ethereumTestnet,
  mainnet: ethereumMainnet,
  // The contract name can be updated using the following command:
  // yarn rename-contract NEW_CONTRACT_NAME
  // Please DO NOT change it manually!
  contractName: 'FomoFairies',
  tokenName: 'FomoFairies NFT',
  tokenSymbol: 'FomoFairies',
  hiddenMetadataUri: 'ipfs://__CID__/hidden.json',
  maxSupply: 3333,
  whitelistSale: {
    price: 0.0,
    maxMintAmountPerTx: 5,
  },
  preSale: {
    price: 0.07,
    maxMintAmountPerTx: 2,
  },
  publicSale: {
    price: 0.003,
    maxMintAmountPerTx: 8,
  },
  contractAddress: '0x206a9d4EE4C4D32d30E3e39cD1Af80F94f4a0A05',
  marketplaceIdentifier: 'FomoFairiesNFT',
  marketplaceConfig: openSea,
  whitelistAddresses: whitelistAddresses,
};

export default CollectionConfig;
