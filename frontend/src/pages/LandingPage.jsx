import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div>
            <div className="relative overflow-hidden bg-white">
                <div className="max-w-8xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
                        <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block">Streamline Your</span>
                                    <span className="block text-custom">Certificate & Meeting Management</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Automate certificate generation and simplify meeting scheduling with CertiMeet. Save time and increase productivity with our all-in-one solution.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link to="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium !rounded-button text-white bg-custom hover:bg-custom/90 md:py-4 md:text-lg md:px-10">
                                            Get Started
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link to="/about" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium !rounded-button text-custom bg-custom/10 hover:bg-custom/20 md:py-4 md:text-lg md:px-10">
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-white">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-custom font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to manage certificates and meetings
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                            {/* Feature 1 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-custom text-white">
                                    <i className="fas fa-certificate text-xl"></i>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Certificate Generation</p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Automatically generate professional certificates for your events and courses.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-custom text-white">
                                    <i className="fas fa-calendar-check text-xl"></i>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Meeting Management</p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Schedule and organize meetings efficiently with our intuitive interface.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-custom text-white">
                                    <i className="fas fa-cloud text-xl"></i>
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Cloud Storage</p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Securely store and manage all your certificates and meeting records.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white">
                <div className="max-w-8xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                Ready to get started?
                            </h2>
                            <p className="mt-3 max-w-3xl text-lg text-gray-500">
                                Join thousands of organizations that use CertiMeet to streamline their certificate generation and meeting management processes.
                            </p>
                            <div className="mt-8 sm:flex">
                                <div className="rounded-md shadow">
                                    <Link to="/signup" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium !rounded-button text-white bg-custom hover:bg-custom/90">
                                        Start Free Trial
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <Link to="/contact" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium !rounded-button text-custom bg-custom/10 hover:bg-custom/20">
                                        Contact Sales
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
                            <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                                <img className="max-h-12" src="/partner1-logo.png" alt="Partner 1" />
                            </div>
                            <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                                <img className="max-h-12" src="/partner2-logo.png" alt="Partner 2" />
                            </div>
                            <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                                <img className="max-h-12" src="/partner3-logo.png" alt="Partner 3" />
                            </div>
                            <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                                <img className="max-h-12" src="/partner4-logo.png" alt="Partner 4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;