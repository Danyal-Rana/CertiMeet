import { FaLinkedin } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-gray-800">
            <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 lg:py-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div>
                        <img className="h-8" src="https://raw.githubusercontent.com/Danyal-Rana/CertiMeet/main/frontend/src/assets/footerLogo.png" alt="CertiMeet" />
                        <p className="mt-4 text-gray-300 text-base">
                            CertiMeet simplifies your workflow by seamlessly combining certificate generation and meeting scheduling into a single, user-friendly platform. Whether you’re organizing events, managing teams, or handling certifications, CertiMeet ensures efficiency and professionalism at every step.
                        </p>
                        <div className="mt-4 flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-twitter text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-linkedin text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-github text-xl"></i>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-300">
                                <i className="fab fa-instagram text-xl"></i>
                            </a>
                        </div>
                    </div>

                    <div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
                            <ul className="mt-4 list-disc list-inside text-base text-gray-300">
                                <li>Computer Science Department</li>
                                <li>Comsats University</li>
                                <li>Park Road, Islamabad</li>
                                <li>aka.mdrana@gmail.com</li>
                                <li>+92-305-216-XXXX</li>
                            </ul>
                        </div>

                        <div className="mt-6 flex space-x-4">
                            <a
                                href="https://www.linkedin.com/in/ranadanyal/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="text-gray-300 hover:text-white"
                            >
                                <FaLinkedin size={30} />
                            </a>
                            <a
                                href="https://github.com/Danyal-Rana"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="text-gray-300 hover:text-white"
                            >
                                <FaSquareGithub size={30} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter"
                                className="text-gray-300 hover:text-white"
                            >
                                <FaSquareXTwitter size={30} />
                            </a>
                            <a
                                href="https://instagram.com/ranadanyalarshad"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="text-gray-300 hover:text-white"
                            >
                                <FaSquareInstagram size={30} />
                            </a>
                        </div>
                    </div>


                    <div>
                        <div className="h-64 w-full rounded-lg overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2646.568068778575!2d73.15441277470502!3d33.65240797331008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfea4aee5bdf8f%3A0xe6b55e05d462beb1!2sCOMSATS%20University%20Islamabad%20(CUI)!5e1!3m2!1sen!2sus!4v1735411291978!5m2!1sen!2sus"
                                className="w-full h-full border-0"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-2">
                    <p className="text-base text-gray-400 text-center">
                        © 2024 CertiMeet. All rights reserved. Powered by{' '}
                        <a
                            href="https://mdrana.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white underline"
                        >
                            Danyal Rana
                        </a>.
                    </p>

                </div>
            </div>
        </footer>
    );
};

export default Footer;