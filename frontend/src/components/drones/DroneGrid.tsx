import { getDrones } from '../../data/mockData';
import { useLanguage } from '../../i18n';
import { DroneCard } from './DroneCard';
export function DroneGrid() {
	const { language } = useLanguage();
	const drones = getDrones(language);
	return <div className="product-grid">{drones.map((drone, index) => <DroneCard key={drone.id} drone={drone} index={index} />)}</div>;
}
