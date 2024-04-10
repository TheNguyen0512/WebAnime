import React from 'react';
import Header from '../../components/common/header';
import Footer from '../../components/common/footer';

const NotFound = () => {
    return (
        <div>
            <Header />
            <section className="notfound">
                <div className='notfound container'>
                    <h1>404 - Not Found</h1>
                    <p>Sorry, the page you are looking for does not exist.</p>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default NotFound;
