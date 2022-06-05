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
  contractName: 'FomoFairiesv10',
  tokenName: 'FomoFairiesv10 NFT',
  tokenSymbol: 'FomoFairiesv10',
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
  contractAddress: '0x68e03eD8dAeA05cC9b9aDFd6530384dCC8571428',
  marketplaceIdentifier: 'FomoFairiesv10NFT',
  marketplaceConfig: openSea,
  whitelistAddresses: whitelistAddresses,
};

export default CollectionConfig;
