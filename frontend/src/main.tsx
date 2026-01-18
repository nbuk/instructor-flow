import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';
import 'dayjs/locale/ru';

import {
  backButton,
  init,
  mainButton,
  miniApp,
  themeParams,
  viewport,
} from '@tma.js/sdk-react';
import dayjs from 'dayjs';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import { App } from './app/App.tsx';

dayjs.locale('ru');

init();
miniApp.mount();
themeParams.mount();
themeParams.bindCssVars();
mainButton.mount();
backButton.mount();
viewport.mount();
viewport.bindCssVars();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
