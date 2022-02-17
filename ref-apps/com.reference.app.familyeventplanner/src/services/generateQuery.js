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

const _kind = 'com.reference.app.service.familyeventplanner:4';
export const generateQuery = {
 findQuery : (obj) => {
  let query = {
   'from':_kind,
   'where':[]
  };
  for (let key in obj) {
   query['where'].push({
    'prop' : key,
    'op': '=',
    'val': obj[key]
   });
  }
  return query;
 },
 filterData : (arr) => {
  let filteredData = {};

  for (let i = 0; i < arr.length; i++) {
   if (!filteredData[arr[i].year]) {
    filteredData[arr[i].year] = {};
   }

   if (!filteredData[arr[i].year][arr[i].month]) {
    filteredData[arr[i].year][arr[i].month] = {};
   }

   if (!filteredData[arr[i].year][arr[i].month][arr[i].date]) {
    filteredData[arr[i].year][arr[i].month][arr[i].date] = [];
   }

   let temp = {};
   temp['title'] = arr[i]['event']['title'];
   temp['description'] = arr[i]['event']['description'];
   temp['image'] = arr[i]['image'];

   filteredData[arr[i].year][arr[i].month][arr[i].date].push(temp);
  }

  return filteredData;
 }
};
