import React, { useState } from 'react'

const LikeToggler = (component,visibility = false) => {
    
const [visible, setVisibility] = useState(() => visibility);

    return [visible ? component : null,()=> setVisibility((v) => !v)];
}

export default LikeToggler;