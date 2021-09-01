import { cloneElement } from 'react';
import { useState } from 'react';

const ComponentSwitcher = ({
  primaryComponent,
  secondaryComponent,
}) => {
  const [isSwitched, setIsSwitched] = useState(false);

  const invertComponent = () => {
    setIsSwitched((isSwitched) => !isSwitched);
  };

  if (isSwitched) {
    return cloneElement(secondaryComponent, {
      invertComponent: invertComponent,
    });
  } else {
    return cloneElement(primaryComponent, {
      invertComponent: invertComponent,
    });
  }
};

export default ComponentSwitcher;
