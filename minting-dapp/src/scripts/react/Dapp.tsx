import React from 'react';
import { ethers, BigNumber } from 'ethers'
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from '@metamask/detect-provider';
import NftContractType from '../lib/NftContractType';
import CollectionConfig from '../../../../smart-contract/config/CollectionConfig';
import NetworkConfigInterface from '../../../../smart-contract/lib/NetworkConfigInterface';
//import CollectionStatus from './CollectionStatus';
import MintWidget from './MintWidget';
import Whitelist from '../lib/Whitelist';
import { themesList } from 'web3modal';

import Sound from './Sound';

const ContractAbi = require('../../../../smart-contract/artifacts/contracts/' + CollectionConfig.contractName + '.sol/' + CollectionConfig.contractName + '.json').abi;

interface Props {
}

interface State {
  userAddress: string|null;
  network: ethers.providers.Network|null,
  networkConfig: NetworkConfigInterface,
  totalSupply: number;
  maxSupply: number;
  maxMintAmountPerTx: number;
  tokenPrice: BigNumber;
  isPaused: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  merkleProofManualAddress: string;
  merkleProofManualAddressFeedbackMessage: string|JSX.Element|null;
  errorMessage: string|JSX.Element|null,
  userWhiteListMinted: boolean;
  connecting: boolean;
}

const defaultState: State = {
  userAddress: null,
  network: null,
  networkConfig: CollectionConfig.mainnet,
  totalSupply: 0,
  maxSupply: 0,
  maxMintAmountPerTx: 0,
  tokenPrice: BigNumber.from(0),
  isPaused: true,
  isWhitelistMintEnabled: false,
  isUserInWhitelist: false,
  merkleProofManualAddress: '',
  merkleProofManualAddressFeedbackMessage: null,
  errorMessage: null,
  userWhiteListMinted: false,
  connecting: false
};

export default class Dapp extends React.Component<Props, State> {
  provider!: Web3Provider;

  contract!: NftContractType;

  private merkleProofManualAddressInput!: HTMLInputElement;

  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  componentDidMount = async () => {
    const browserProvider = await detectEthereumProvider() as ExternalProvider;

    if (browserProvider?.isMetaMask !== true) {
      this.setError( 
        <>
          We were not able to detect <strong>MetaMask</strong>. We value <strong>privacy and security</strong> a lot so we limit the wallet options on the DAPP.<br />
          {/*<br />
          But don't worry! <span className="emoji">😃</span> You can always interact with the smart-contract through <a href={this.generateContractUrl()} target="_blank">{this.state.networkConfig.blockExplorer.name}</a> and <strong>we do our best to provide you with the best user experience possible</strong>, even from there.<br />
          <br />
          You can also get your <strong>Whitelist Proof</strong> manually, using the tool below.*/}
        </>,
      );
    }

    this.provider = new ethers.providers.Web3Provider(browserProvider);

    this.registerWalletEvents(browserProvider);
    await this.connectWallet();
    console.log(this.state)
    //await this.initWallet();
  }


  //audio = new Audio('https://cms-duck.s3.eu-west-2.amazonaws.com/metaraver_1.mp3');

  async enterAdventure(): Promise<void> {
    
  }

  async mintTokens(amount: number): Promise<void>
  {
    try {
      await this.contract.mint(amount, {value: this.state.tokenPrice.mul(amount)});
    } catch (e) {
      this.setError(e);
    }
  }

  async whitelistMintTokens(amount: number): Promise<void>
  {
   /* try {
      if (this.state.userAddress && this.state.totalSupply < 800) {
        //const result = await this.contract.checkWhiteListForUser(this.state.userAddress);
        //console.log(result, 'hello');
        await this.contract.whitelistMint(amount, {value: this.state.tokenPrice.mul(amount)});
      } else {
        this.setError('free mint over, public sale incoming');
      }
    } catch (e) {
      this.setError(e);
    }*/
  }

  private isWalletConnected(): boolean
  {
    console.log(this.state.userAddress)
    return true; //this.state.userAddress !== null;
  }

  private isContractReady(): boolean
  {
    return this.contract !== undefined;
  }

  private isSoldOut(): boolean
  {
    return this.state.maxSupply !== 0 && this.state.totalSupply < this.state.maxSupply;
  }

  private isNotMainnet(): boolean
  {
    return this.state.network !== null && this.state.network.chainId !== CollectionConfig.mainnet.chainId;
  }

  private copyMerkleProofToClipboard(): void
  {
    const merkleProof = Whitelist.getRawProofForAddress(this.state.userAddress ?? this.state.merkleProofManualAddress);

    if (merkleProof.length < 1) {
      this.setState({
        merkleProofManualAddressFeedbackMessage: 'The given address is not in the whitelist, please double-check.',
      });

      return;
    }

    navigator.clipboard.writeText(merkleProof);

    this.setState({
      merkleProofManualAddressFeedbackMessage: 
      <>
        <strong>Congratulations!</strong> <span className="emoji">🎉</span><br />
        Your Merkle Proof <strong>has been copied to the clipboard</strong>. You can paste it into <a href={this.generateContractUrl()} target="_blank">{this.state.networkConfig.blockExplorer.name}</a> to claim your tokens.
      </>,
    });
  }

  render() {
    return (
      <>
        <div className="dapp">
          <div className="container">
            <figure className="container__back">
              <img src="build/images/background.png"/>
            </figure>
            <div className="container__content">
              <div className="container__photos">
                <figure className="container__photos--wall">
                  <img src="build/images/wall.png"/>
                </figure>
                <div className="container__photositems">
                  <div className="container__photositems--area">
                    <div className="container__photositems--item">
                      <div className="container__photositems--background" style={{
                          backgroundImage: `url('/build/images/photoframe.png')`
                      }}>
                        <figure className="one">
                          <img src="build/images/photo1.png"/>
                        </figure>
                      </div>
                    </div>
                    <div className="container__photositems--item">
                      <div className="container__photositems--background" style={{
                          backgroundImage: `url('/build/images/photoframe.png')`
                      }}>
                        <figure className="two">
                          <img src="build/images/photo2.png"/>
                        </figure>
                      </div>
                    </div>
                  </div>
                  <div className="container__photositems--area">
                    <div className="container__photositems--item">
                      <div className="container__photositems--background" style={{
                          backgroundImage: `url('/build/images/photoframe.png')`
                      }}>
                        <figure className="three">
                          <img src="build/images/photo3.png"/>
                        </figure>
                      </div>
                    </div>
                    <div className="container__photositems--item">
                      <div className="container__photositems--background" style={{
                          backgroundImage: `url('/build/images/photoframe.png')`
                      }}>
                        <figure className="four">
                          <img src="build/images/photo4.png"/>
                        </figure>
                      </div>
                    </div>
                  </div>
                  <div className="container__photositems--area">
                    <div className="container__photositems--item">
                      <div className="container__photositems--background" style={{
                          backgroundImage: `url('/build/images/photoframe.png')`
                      }}>
                        <figure className="five">
                          <img src="build/images/photo5.png"/>
                        </figure>
                      </div>
                    </div>
                    <div className="container__photositems--item">
                      <div className="container__photositems--background" style={{
                          backgroundImage: `url('/build/images/photoframe.png')`
                      }}>
                        <figure className="six">
                          <img src="build/images/photo6.png"/>
                        </figure>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container__mintarea">
                {this.isNotMainnet() ?
                <span>
                </span>
                : null}

                {this.state.errorMessage ? <div className="error"><p>{this.state.errorMessage}</p><button onClick={() => this.setError()}>X</button></div> : null}
                <div className="container__mintbobo">
                  <figure>
                    <img src="build/images/onceuponatimebackground.png"/>
                  </figure>
                  <figure>
                    <img src="build/images/bobo.png"/>
                  </figure>
                </div>
                <MintWidget
                  maxSupply={this.state.maxSupply}
                  totalSupply={this.state.totalSupply}
                  tokenPrice={this.state.tokenPrice}
                  maxMintAmountPerTx={this.state.maxMintAmountPerTx}
                  isPaused={this.state.isPaused}
                  isWhitelistMintEnabled={this.state.isWhitelistMintEnabled}
                  isUserInWhitelist={this.state.isUserInWhitelist}
                  mintTokens={(mintAmount) => this.mintTokens(mintAmount)}
                  whitelistMintTokens={(mintAmount) => this.whitelistMintTokens(mintAmount)}
                  connectWallet={() => this.connectWallet()}
                  connecting={this.state.connecting}
                  userAddress={this.state.userAddress}
                />
              </div>

              <figure className="logo">
                <img src="build/images/logo.png"/>
              </figure>
            </div>
          </div>
        </div>
      </>
    );
  }

  private setError(error: any = null): void
  {
    let errorMessage = 'Unknown error...';

    if (null === error || typeof error === 'string') {
      errorMessage = error;
    } else if (typeof error === 'object') {
      // Support any type of error from the Web3 Provider...
      if (error?.error?.message !== undefined) {
        errorMessage = error.error.message;
      } else if (error?.data?.message !== undefined) {
        errorMessage = error.data.message;
      } else if (error?.message !== undefined) {
        errorMessage = error.message;
      } else if (React.isValidElement(error)) {
        this.setState({errorMessage: error});
  
        return;
      }
    }

    this.setState({
      errorMessage: null === errorMessage ? null : errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
    });
  }

  private generateContractUrl(): string
  {
    return this.state.networkConfig.blockExplorer.generateContractUrl(CollectionConfig.contractAddress!);
  }

  private generateMarketplaceUrl(): string
  {
    return CollectionConfig.marketplaceConfig.generateCollectionUrl(CollectionConfig.marketplaceIdentifier, !this.isNotMainnet());
  }

  private async connectWallet(): Promise<void>
  {
    try {
      this.setState({
        connecting: true
      });

      await this.provider.provider.request!({ method: 'eth_requestAccounts' });

      this.initWallet();
    } catch (e) {
      this.setError(e);
    }
  }

  private async initWallet(): Promise<void>
  {
    const walletAccounts = await this.provider.listAccounts();
    console.log(walletAccounts)
    
    this.setState(defaultState);

    if (walletAccounts.length === 0) {
      return;
    }

    const network = await this.provider.getNetwork();
    let networkConfig: NetworkConfigInterface;

    if (network.chainId === CollectionConfig.mainnet.chainId) {
      networkConfig = CollectionConfig.mainnet;
    } else if (network.chainId === CollectionConfig.testnet.chainId) {
      networkConfig = CollectionConfig.testnet;
    } else {
      this.setError('Unsupported network!');

      return;
    }
    
    this.setState({
      userAddress: walletAccounts[0],
      network,
      networkConfig,
    });

    if (await this.provider.getCode(CollectionConfig.contractAddress!) === '0x') {
      this.setError('Could not find the contract, are you connected to the right chain?');

      return;
    }

    this.contract = new ethers.Contract(
      CollectionConfig.contractAddress!,
      ContractAbi,
      this.provider.getSigner(),
    ) as NftContractType;

    this.setState({
      maxSupply: (await this.contract.maxSupply()).toNumber(),
      totalSupply: (await this.contract.totalSupply()).toNumber(),
      maxMintAmountPerTx: (await this.contract.maxMintAmountPerTx()).toNumber(),
      tokenPrice: await this.contract.cost(),
      isPaused: await this.contract.paused(),
      isWhitelistMintEnabled: await this.contract.whitelistMintEnabled(),
      isUserInWhitelist: Whitelist.contains(this.state.userAddress ?? '')
    });
  }

  private registerWalletEvents(browserProvider: ExternalProvider): void
  {
    // @ts-ignore
    browserProvider.on('accountsChanged', () => {
      this.initWallet();
    });

    // @ts-ignore
    browserProvider.on('chainChanged', () => {
      window.location.reload();
    });
  }
}
