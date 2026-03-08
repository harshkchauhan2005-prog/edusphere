import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'border-b border-slate-200/20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-lg shadow-sm' : 'border-transparent bg-background-light/50 dark:bg-background-dark/50 backdrop-blur-sm'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <span className="material-symbols-rounded">school</span>
                        </div>
                        <span className="text-2xl font-display font-bold tracking-tight">EduSphere</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a className="hover:text-primary transition-colors" href="#">Courses</a>
                        <a className="hover:text-primary transition-colors" href="#">Resources</a>
                        <a className="hover:text-primary transition-colors" href="#">Faculty</a>
                        <a className="hover:text-primary transition-colors" href="#">About</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors">Log in</Link>
                        <Link to="/register" className="hidden sm:flex bg-primary hover:bg-teal-400 text-black px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(45,212,191,0.4)] active:translate-y-0 active:scale-95">
                            Get Started
                        </Link>
                        {/* Mobile menu button */}
                        <button
                            className="md:hidden relative z-50 flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            <span className="material-symbols-rounded">
                                {isMobileMenuOpen ? 'close' : 'menu'}
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden fixed inset-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl transition-all duration-300 pt-24 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'
                }`}>
                <div className="flex flex-col items-center gap-6 text-lg font-medium p-6 h-full overflow-y-auto">
                    <a className="hover:text-primary transition-colors w-full text-center py-3 border-b border-slate-200 dark:border-slate-800" href="#" onClick={() => setIsMobileMenuOpen(false)}>Courses</a>
                    <a className="hover:text-primary transition-colors w-full text-center py-3 border-b border-slate-200 dark:border-slate-800" href="#" onClick={() => setIsMobileMenuOpen(false)}>Resources</a>
                    <a className="hover:text-primary transition-colors w-full text-center py-3 border-b border-slate-200 dark:border-slate-800" href="#" onClick={() => setIsMobileMenuOpen(false)}>Faculty</a>
                    <a className="hover:text-primary transition-colors w-full text-center py-3 border-b border-slate-200 dark:border-slate-800" href="#" onClick={() => setIsMobileMenuOpen(false)}>About</a>

                    <div className="flex flex-col w-full gap-4 mt-4">
                        <Link to="/login" className="w-full py-4 text-center rounded-xl border border-slate-200 dark:border-slate-700 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            Log in
                        </Link>
                        <Link to="/register" className="w-full py-4 text-center rounded-xl bg-primary text-black font-bold shadow-lg hover:shadow-[0_4px_20px_rgba(45,212,191,0.4)] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>

            <section className="relative pt-40 pb-20 overflow-hidden hero-gradient">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Join 56k+ students worldwide
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-8 tracking-tight leading-[1.1]">
                            Keep learning and boost your <span className="text-primary">knowledge</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                            A collaborative digital learning platform designed for students, faculty, and admins to share knowledge and excel together.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="group w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_8px_30px_rgba(45,212,191,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95">
                                Start a free course
                                <span className="material-symbols-rounded transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto px-8 py-4 border border-slate-200 dark:border-slate-800 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-300 text-center transform hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:scale-95">
                                View curriculum
                            </Link>
                        </div>
                    </div>
                    <div className="relative mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                            <div className="relative rounded-xl overflow-hidden mb-4 aspect-video bg-slate-100 dark:bg-slate-800">
                                <img alt="Programming course" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBAt6E9HtcwuW2vZYErhXCBGbB9TmNcVtBtL1JGvsC63BNT7IUn76pm05ImGJIOnT6aURLU77v8iUUuIasfx7OB54yteBtuBPSEJlGNdwXeLWrpFmCBerjNSTmvTTcz0-5OBY0KTb6Yg5zPqnaoXbAZy2-WyBNTWon4vo1VGw7kM5dAQGJZVH9biDnIM6qG0tYvD4si07cU748_fnHylweI17fMfPGNvRxjVUFaKB7apeZuWAOur8fZnMKoiMfLTAmt0U_uFy_K2Y" />
                                <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-black text-[10px] font-bold rounded">BESTSELLER</div>
                            </div>
                            <h3 className="font-display font-bold text-lg mb-2">Modern Web Architecture</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Master the art of building scalable applications with React and Node.</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <span className="material-symbols-rounded text-sm">star</span>
                                    <span className="text-xs font-bold">4.9/5</span>
                                </div>
                                <span className="text-primary text-xs font-bold flex items-center gap-1">Start now <span className="material-symbols-rounded text-sm">chevron_right</span></span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-2xl z-20 md:scale-110 border-2 border-primary/20">
                            <div className="relative rounded-xl overflow-hidden mb-4 aspect-video bg-slate-100 dark:bg-slate-800">
                                <img alt="UI/UX Design course" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmU00PQb9MUqXUcMtybq_1O3_9bpp6IbECD8LUk-ISJjLn2SUuOdvqs1wXyIw-Mkckp4RcgVc3-vY2vfblNQUj2b-Ug_kvlNY-0sB4fnBnhPmPDfJ_U29MqcbqUWa2ofCM3HDIGfwys-t6FjRNlnubjsK3TluMxf4PtA3VDt2hSkS955fw76nYK5CxSX_eJcAVdDSwv_7I5pDZkRFsSNVrM5Va7xpWwP100UlsjP8QMJG__sAR_PTvH7xBo3Dc3cSMu6dCkc67_uA" />
                                <button className="absolute inset-0 flex items-center justify-center bg-black/20 group">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110">
                                        <span className="material-symbols-rounded text-3xl">play_arrow</span>
                                    </div>
                                </button>
                            </div>
                            <h3 className="font-display font-bold text-xl mb-2">UI/UX Design Masterclass</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Learn how to make a product attractive and user-friendly through design systems.</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <span className="material-symbols-rounded text-sm">star</span>
                                    <span className="text-xs font-bold">4.8/5</span>
                                </div>
                                <span className="text-primary text-xs font-bold flex items-center gap-1">Start now <span className="material-symbols-rounded text-sm">chevron_right</span></span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-card-dark p-6 rounded-2xl shadow-xl transform rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                            <div className="relative rounded-xl overflow-hidden mb-4 aspect-video bg-slate-100 dark:bg-slate-800">
                                <img alt="Photography course" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKGkoeRXvIVQUo4T-KsziIdA7gHnVfJ8puhSUsaNuOiPXeObSdONZOjQbz3rOnAS-zGfo0_wseymY-BX2Sb01Vj6jZhFxlg1HRL1ShpQ-AAOZLQX6dbORkfMYlJ2J-juglvoVSuFjHpeZapD0kwGP_y2XB9AlctqS3znnsPsvmelCGnMCGLkTbYi7You7Yiem9TgB47mqMjuQ6TMhAH6O0aWAeuQ0kt56Qxi-SIGWZJ4ado7mA0r7wj8psH8grdTLsZZwwb3AuKFk" />
                            </div>
                            <h3 className="font-display font-bold text-lg mb-2">Creative Direction</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Improve storytelling through visual lenses and lighting techniques.</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <span className="material-symbols-rounded text-sm">star</span>
                                    <span className="text-xs font-bold">4.7/5</span>
                                </div>
                                <span className="text-primary text-xs font-bold flex items-center gap-1">Start now <span className="material-symbols-rounded text-sm">chevron_right</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="py-12 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-rounded">bolt</span> Learnova</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-rounded">radio_button_checked</span>ScholarsSphere</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-rounded">hub</span> BrightNexus</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-rounded">terminal</span> ApexEdu</div>
                        <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-rounded">grid_view</span> EduVerse</div>
                    </div>
                </div>
            </div>
            <section className="py-24 bg-background-light dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-4">How EduSphere Works</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">Our streamlined process ensures faculty and students can connect instantly and start learning without hurdles.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white dark:bg-card-dark rounded-2xl shadow-lg border-2 border-primary flex items-center justify-center mb-6">
                                <span className="material-symbols-rounded text-primary text-3xl">post_add</span>
                            </div>
                            <h4 className="font-bold text-xl mb-3">Faculty Creates Course</h4>
                            <p className="text-sm text-slate-500">Educators design curricula, upload materials, and set assessment parameters.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white dark:bg-card-dark rounded-2xl shadow-lg border-2 border-primary flex items-center justify-center mb-6">
                                <span className="material-symbols-rounded text-primary text-3xl">key</span>
                            </div>
                            <h4 className="font-bold text-xl mb-3">Unique Course ID</h4>
                            <p className="text-sm text-slate-500">Each course generates a secure ID to ensure only authorized students can access it.</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-white dark:bg-card-dark rounded-2xl shadow-lg border-2 border-primary flex items-center justify-center mb-6">
                                <span className="material-symbols-rounded text-primary text-3xl">group_add</span>
                            </div>
                            <h4 className="font-bold text-xl mb-3">Students Join & Peer Share</h4>
                            <p className="text-sm text-slate-500">Students enter the ID and immediately start collaborating with peers and faculty.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-slate-50 dark:bg-slate-900/20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl font-display font-bold mb-6">Everything you need to <span className="text-primary">succeed digitally</span></h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">We've built a comprehensive toolset for modern academia, focusing on engagement and measurable outcomes.</p>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-rounded">quiz</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Interactive Quizzes</h4>
                                        <p className="text-sm text-slate-500">Real-time feedback loops to help students identify their weak points immediately.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-rounded">forum</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Peer-to-Peer Sharing</h4>
                                        <p className="text-sm text-slate-500">Community forums and project sharing tools to encourage collaborative learning.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-rounded">analytics</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">Detailed Analytics</h4>
                                        <p className="text-sm text-slate-500">Admins and faculty get deep insights into student engagement and performance.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                                <img alt="Students collaborating" className="w-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKHLAuW1GbuHxuHy2g-jL_bnw5hvpF0e6DI89zdcMaVL-_iFC4j8uWGxN5wyCwdg3I_b8w0SiAMrl1tT5c5fs1z3JOtKmW2AFRZnCao69B7TjJ0lM7I_bT_ahlqocAgbEGZm2eqVuBqww4bxR7qHxMWMh_F2KM1zLxCsxoRx4I-dqAbmEyYvbvIZFYF4CdDXBR_ktajtcuJLnDZLHGnUhp4plGItdiN4jdJSeSc1Lf-TZkKDMLytcYMmJFM33lb3-ScyqEcAM5BkY" />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 -z-10"></div>
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-700"></div>
                        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-black mb-8 relative z-10 leading-tight">
                            Ready to transform your <br />academic experience?
                        </h2>
                        <p className="text-black/70 text-lg mb-12 max-w-2xl mx-auto relative z-10 font-medium">
                            Join thousands of educators and students who are already using EduSphere to redefine the boundaries of digital learning.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                            <Link to="/register" className="px-10 py-5 bg-black text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-900 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 block max-w-max mx-auto sm:mx-0">
                                Sign Up for Free
                            </Link>
                            <Link to="/contact" className="px-10 py-5 bg-white text-black font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 block max-w-max mx-auto sm:mx-0">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="bg-slate-100 dark:bg-slate-900/50 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                        <div className="col-span-2 lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                    <span className="material-symbols-rounded text-sm">school</span>
                                </div>
                                <span className="text-xl font-display font-bold">EduSphere</span>
                            </div>
                            <p className="text-slate-500 max-w-xs mb-6">
                                Leading the way in digital academic transformation for the next generation of learners.
                            </p>
                            <div className="flex gap-4">
                                <a className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" href="#">
                                    <span className="material-symbols-rounded">public</span>
                                </a>
                                <a className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" href="#">
                                    <span className="material-symbols-rounded">alternate_email</span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6">Platform</h5>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><a className="hover:text-primary transition-colors" href="#">Courses</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Faculty Tools</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Analytics</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6">Resources</h5>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><a className="hover:text-primary transition-colors" href="#">Documentation</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Community</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6">Company</h5>
                            <ul className="space-y-4 text-sm text-slate-500">
                                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
                                <li><a className="hover:text-primary transition-colors" href="#">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">© {new Date().getFullYear()} EduSphere. All rights reserved.</p>
                        <div className="flex gap-6 text-sm text-slate-500">
                            <a className="hover:text-primary" href="#">Terms of Service</a>
                            <a className="hover:text-primary" href="#">Privacy Policy</a>
                            <a className="hover:text-primary" href="#">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
