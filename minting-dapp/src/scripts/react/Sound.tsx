import React from 'react';

import useSound from 'use-sound'

const Sound = () => {
  const [playSound] = useSound('https://cms-duck.s3.eu-west-2.amazonaws.com/metaraver_1.mp3');

  playSound();

  return(
    <div>

    </div>
  )
}

export default Sound;