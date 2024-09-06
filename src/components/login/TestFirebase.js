import { auth } from "../../lib/firebase";

const TestFirebase = () => {
    console.log(auth); // Test if `auth` is being imported correctly
    return <div>Check the console for auth object.</div>;
};

export default TestFirebase;
