import Error from './Error';

export default function FourOhFour() {
  return (
    <Error
      errorMessage="Error 404: This page can’t be found."
      errorAction={
        <>
          The page your looking for may have been moved or deleted.
          Please contact your administrator for more information.
          <br />
          <br />
          Use your browser to navigate to the previous page.
        </>
      }
    />
  );
}
