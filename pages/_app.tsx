import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import '../styles/ToastCustom.css'; 


export default function App({ Component, pageProps }: AppProps) {
  return (
  <div>
    <Component {...pageProps} />
      <ToastContainer />
  </div>
  );
}
