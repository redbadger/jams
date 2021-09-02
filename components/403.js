import Error from './Error';

export default function FourOhThree() {
  return (
    <Error
      errorMessage="Error 403: You are not authorised to view this page."
      errorAction={
        <>
          Please contact your administrator for more information.
          <br />
          <br />
          Use your browser to navigate to the previous page.
        </>
      }
    />
  );
}
