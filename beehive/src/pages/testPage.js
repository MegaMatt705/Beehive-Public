import React, { useState } from 'react';
import Settings from './Settings';
import Post from '../components/post';

function TestPage() {
  const [showLike, setShow1] = useState(true);
  const [showComment, setShow] = useState(true);

  const handleToggleHideLike = () => {
    setShow1(!showLike);
  };

  const handleToggleHideComment = () => {
    setShow(!showComment);
  };

  return (
    <div>
      <Settings
        showLike={showLike}
        showComment={showComment}
        onToggleHideLike={handleToggleHideLike}
        onToggleHideComment={handleToggleHideComment}
      />
      {/* <Post showLike={showLike} showComment={showComment} /> */}
      <Post showLike={showLike} setShow1={setShow1} />
    </div>
  );
}

export default TestPage;