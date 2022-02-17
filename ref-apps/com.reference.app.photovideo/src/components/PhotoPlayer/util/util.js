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

const debounce = (func, wait) => {
 let timeout;
 return function (...args) {
  const context = this;
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
   timeout = null;
   func.apply(context, args);
  }, wait);
 };
};

const getWidth = () => {
 const isClient = typeof window === 'object';
 const width = isClient ? window.innerWidth : 0;
 return width;
};

const getHeight = () => {
 const isClient = typeof window === 'object';
 const height = isClient ? window.innerHeight : 0;
 return height;
};

const getSlidesOnCurrentIndex = (currentIndex, slides) => {
 const [firstSlide, secondSlide, ...restSlides] = [...slides];
 const lastSlide = restSlides[restSlides.length - 1];
 let currentSlides = [];

 if (currentIndex === slides.length - 1) {
  currentSlides = [slides[slides.length - 2], lastSlide, firstSlide];
 } else if (currentIndex === 0) {
  currentSlides = [lastSlide, firstSlide, secondSlide];
 } else {
  currentSlides = slides.slice(currentIndex - 1, currentIndex + 2);
 }
 return currentSlides;
};

export {
 debounce,
 getHeight,
 getSlidesOnCurrentIndex,
 getWidth
};
