// This component encapsulates the styling and structure for each feature card --> HOME PAGE
const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
        <div className="gradient-icon text-white rounded-full h-12 w-12 flex items-center justify-center mb-4 mx-auto">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-base">{description}</p>
    </div>
);
export { FeatureCard };