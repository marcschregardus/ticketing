import buildClient from '../api/build-client'

const LandingPage = ({currentUser}) => {
    return currentUser ? (
        <h1>You are signed in</h1>
    ) : (
        <h1>You are NOT signed in</h1>
    );
}

// Server side calls (mostly!)
LandingPage.getInitialProps = async context => {
    console.log('Landing Page!');
    let client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    return data;
};

export default LandingPage;
