// Copyright (c) 2021 LG Electronics, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

import {render} from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';

const store = configureStore();

const appElement = (
 <Provider store={store}>
  <App />
 </Provider>
);

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
 render(appElement, document.getElementById('root'));
}

export default appElement;
