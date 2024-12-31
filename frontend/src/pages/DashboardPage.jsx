import React from 'react';
import FileManager from '../components/FileManager';
import TemplateManager from '../components/TemplateManager';

const DashboardPage = () => {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Files</h3>
                        <FileManager />
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-4">Templates</h3>
                        <TemplateManager />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;