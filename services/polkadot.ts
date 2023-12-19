// polkadot.ts
import { ApiPromise, WsProvider } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// export type AccountInfo = any; // Define a more specific type if needed

export async function setupPolkadotApi(): Promise<ApiPromise> {
  const provider = new WsProvider('wss://rococo-rpc.polkadot.io');
  const api = await ApiPromise.create({ provider });
  return api;
}

export async function mintInscription(account: InjectedAccountWithMeta, inscriptionData: string) {
    const { web3FromSource } = await import('@polkadot/extension-dapp');
    const injector = await web3FromSource(account.meta.source);
    const api = await ApiPromise.create({ 
        provider: new WsProvider('wss://rococo-rpc.polkadot.io')
      });  
    const transaction = api.tx.system.remarkWithEvent(inscriptionData);
  
    const hash = await transaction.signAndSend(account.address, { signer: injector.signer });
  
    return hash; // Transaction hash
  }

export async function connectWallet(walletPrefix: string): Promise<InjectedAccountWithMeta[]> {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp');
    const extensions = await web3Enable('Dotsmarkets');
    if (extensions.length === 0) {
      // This could mean no extensions are installed, or the user rejected the connection.
      return [];
    }

    const targetExtension = extensions.find(extension => extension.name.startsWith(walletPrefix));
    if (!targetExtension) {
      console.log(`${walletPrefix} wallet extension not found.`);
      return [];
    }

    const allAccounts = await web3Accounts();
    const accounts = allAccounts.filter(account => account.meta.source === targetExtension.name);
    return accounts;
  } catch (error) {
    console.error(`Error connecting to ${walletPrefix} wallet:`, error);
    return [];
  }
}




