import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faCalendarCheck, faCloud } from '@fortawesome/free-solid-svg-icons';


const LandingPage = () => {
    return (
        <div>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gray-50">
                <div className="max-w-8xl mx-auto">
                    <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
                        <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="flex items-center justify-between sm:flex-col lg:flex-row">
                                {/* Left Side Content */}
                                <div className="lg:w-1/2 sm:text-center lg:text-left">
                                    <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
                                        <span className="block">Streamline Your</span>
                                        <span className="block text-black">Certificate & Meeting Management</span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                        Automate certificate generation and simplify meeting scheduling with CertiMeet. Save time and increase productivity with our all-in-one solution.
                                    </p>
                                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                        <div className="rounded-md shadow">
                                            <Link to="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium !rounded-button text-white bg-black hover:bg-black/90 md:py-4 md:text-lg md:px-10">
                                                Get Started
                                            </Link>
                                        </div>
                                        <div className="mt-3 sm:mt-0 sm:ml-3">
                                            <Link to="/about" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium !rounded-button text-black bg-black/10 hover:bg-black/20 md:py-4 md:text-lg md:px-10">
                                                Learn More
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side Image */}
                                <div className="lg:w-1/2 mt-10 lg:mt-0">
                                    <img src="https://cdn.britannica.com/29/150929-050-547070A1/lion-Kenya-Masai-Mara-National-Reserve.jpg" alt="CertiMeet" className="w-full h-auto object-cover rounded-md shadow-md" />
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
                        <h2 className="text-base text-black font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to manage certificates and meetings
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                            {/* Feature 1 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-black text-white">
                                    <FontAwesomeIcon icon={faCertificate} className="text-xl" />
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Certificate Generation</p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Automatically generate professional certificates for your events and courses.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-black text-white">
                                    <FontAwesomeIcon icon={faCalendarCheck} className="text-xl" />
                                </div>
                                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Meeting Management</p>
                                <p className="mt-2 ml-16 text-base text-gray-500">
                                    Schedule and organize meetings efficiently with our intuitive interface.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="relative">
                                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-black text-white">
                                    <FontAwesomeIcon icon={faCloud} className="text-xl" />
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

            {/* How it Works Section */}
            <div className="py-16 bg-gray-50 overflow-hidden">
                <div className="max-w-8xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-custom font-semibold tracking-wide uppercase">How It Works</h2>
                        <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Simple steps to get started
                        </p>
                    </div>

                    <div className="relative">
                        <div className="relative md:grid md:grid-cols-2 md:gap-8">
                            <div className="md:col-span-1">
                                <h3 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Certificate Generation</h3>
                                <p className="mt-3 text-lg text-gray-500">
                                    Create professional certificates in just a few clicks. Upload your template, add recipient details, and generate certificates in bulk.
                                </p>
                                <div className="mt-10">
                                    <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-custom hover:bg-custom/90">Try Certificate Generator</a>
                                </div>
                            </div>
                            <div className="mt-10 relative md:mt-0">
                                <img className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZQNgU_vjekDY_APdAOH3P24g8nBZlVrmvmQ&s" />
                            </div>
                        </div>
                    </div>

                    <div className="relative mt-12">
                        <div className="relative md:grid md:grid-cols-2 md:gap-8">
                            <div className="md:col-span-1 order-2 md:order-1">
                                <img className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5" src="https://cdn.prod.website-files.com/665f17d0fb4bfc1e811460d3/665f17d0fb4bfc1e8114681c_7.jpg" alt="Meeting scheduling interface" />
                            </div>
                            <div className="mt-10 relative md:mt-0 order-1 md:order-2">
                                <h3 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Meeting Management</h3>
                                <p className="mt-3 text-lg text-gray-500">
                                    Schedule meetings efficiently with our intuitive calendar interface. Send invitations, manage attendees, and track responses all in one place.
                                </p>
                                <div className="mt-10">
                                    <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-custom hover:bg-custom/90">Schedule a Meeting</a>
                                </div>
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
                                    <Link to="/signup" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium !rounded-button text-white bg-black hover:bg-black/90">
                                        Start Free Trial
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <Link to="/contact" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium !rounded-button text-black bg-black/10 hover:bg-black/20">
                                        Contact Sales
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
                            {/* Partner 1 - Google */}
                            <div className="col-span-1 flex justify-center items-center bg-gray-50">
                                <img className="h-full w-full object-contain" src="https://download.logo.wine/logo/Google/Google-Logo.wine.png" alt="Google Logo" />
                            </div>

                            {/* Partner 2 - Amazon */}
                            <div className="col-span-1 flex justify-center items-center bg-gray-50">
                                <img className="h-full w-full object-contain" src="https://w7.pngwing.com/pngs/732/34/png-transparent-logo-amazon-com-brand-flipkart-others-text-orange-logo.png" alt="Amazon Logo" />
                            </div>

                            {/* Partner 3 - Microsoft */}
                            <div className="col-span-1 flex justify-center items-center bg-gray-50">
                                <img className="h-full w-full object-contain" src="https://w7.pngwing.com/pngs/124/600/png-transparent-microsoft-logo-microsoft-thumbnail.png" alt="Microsoft Logo" />
                            </div>

                            {/* Partner 4 - Twitter */}
                            <div className="col-span-1 flex justify-center items-center bg-gray-50">
                                <img className="h-full w-full object-contain" src="https://1000logos.net/wp-content/uploads/2017/06/logo-Twitter.png" alt="Twitter Logo" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;