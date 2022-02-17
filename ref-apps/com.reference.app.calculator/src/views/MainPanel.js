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

import Calculator from "../components/Calculator";
import { Panel } from "@enact/moonstone/Panels";
import Header from "../components/Header";
const handleClose = () => {
  if (typeof window !== "undefined") {
    window.close();
  }
};
const MainPanel = (props) => {
  return (
    <Panel {...props} style={{ backgroundColor: "black" }}>
      <Header onClose={handleClose}></Header>
      <Calculator />
    </Panel>
  );
};

export default MainPanel;
