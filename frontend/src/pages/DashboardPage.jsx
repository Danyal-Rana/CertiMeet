const DashboardPage = () => {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Files</h3>
                        <div className="space-y-4">
                            <button className="bg-black text-white px-4 py-2 rounded-md">
                                Add New File
                            </button>
                            <div className="mt-4">
                                <h4 className="font-medium">Existing Files:</h4>
                                <ul className="mt-2 space-y-2">
                                    {/* Add file list items here */}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Templates</h3>
                        <div className="space-y-4">
                            <button className="bg-black text-white px-4 py-2 rounded-md">
                                Add New Template
                            </button>
                            <div className="mt-4">
                                <h4 className="font-medium">Existing Templates:</h4>
                                <ul className="mt-2 space-y-2">
                                    {/* Add template list items here */}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;  