// import React, { createContext, ReactNode, useContext, useState } from 'react';
// import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// // Define the shape of your context data
// interface AccountContextProps {
//   account: InjectedAccountWithMeta | null;
//   setAccount: (account: InjectedAccountWithMeta | null) => void;
// }

// // Create the context
// const AccountContext = createContext<AccountContextProps | undefined>(undefined);

// // Define the provider component
// const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);

//   // Provide a well-defined object that matches AccountContextProps
//   const contextValue: AccountContextProps = { account, setAccount };
//   export const AccountContext = createContext<AccountContextProps | undefined>(undefined);

//   return (
//     <AccountContext.Provider value={contextValue}>
//       {children}
//     </AccountContext.Provider>
//   );
// };

// // Custom hook to use the account context
// const useAccount = () => {
//   const context = useContext(AccountContext);
//   if (!context) {
//     throw new Error('useAccount must be used within a AccountProvider');
//   }
//   return context;
// };

// export { AccountProvider, useAccount };
