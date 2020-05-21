import buildClient from '../api/build-client'

const LandingPage = ({currentUser}) => {
    console.log(currentUser);
    // axios.get('/api/users/currentuser')
    return <h1>Landing Page</h1>;
}

// Server side calls (mostly!)
LandingPage.getInitialProps = async (context) => {
    let client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    return data;
};

export default LandingPage;
