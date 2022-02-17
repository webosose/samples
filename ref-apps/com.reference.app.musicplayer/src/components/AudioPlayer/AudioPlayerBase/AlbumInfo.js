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

import React from "react";
import placeHolderImg from "../../../../assets/images/defaultalbum.png";
import css from "./AlbumInfo.module.less";
import { getEncodedPath } from "./util";

function AlbumInfo({ title, artist, album, thumbnail, isPlaying }) {
  let imgSrc =
    thumbnail && thumbnail.length > 0
      ? getEncodedPath(thumbnail)
      : placeHolderImg;
  const getTitle = () => {
    if (isPlaying === true) {
      return (
        <marquee>
          <p className={css.title}>{title}</p>
        </marquee>
      );
    } else {
      return <p className={css.title}> {title} </p>;
    }
  };
  let artists = artist === 0 ? "" : artist;
  let albums = album === 0 ? "" : album;

  return (
    <div className={css.album}>
      <img className={css.albumimage} src={imgSrc} />
      <div className={css.info}>
        {getTitle()}
        <p className={css.subtitle}> {artists} </p>
        <p className={css.albumname}> {albums} </p>
      </div>
    </div>
  );
}

export default React.memo(AlbumInfo);
