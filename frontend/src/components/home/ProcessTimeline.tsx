import { Check } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { Container } from '../common/Container';

export function ProcessTimeline() {
	const { t } = useLanguage();
	const process = t('home.process.steps').split('|');

	return (
		<section className="process-timeline">
			<Container>
				<div className="timeline-heading">
					<span className="eyebrow dark"><i/> {t('home.process.kicker')}</span>
					<h2>{t('home.process.title')}<br/><em>{t('home.process.titleAccent')}</em></h2>
				</div>
				<ol>
					{process.map((item, index) => (
						<li key={item}><b>0{index + 1}</b><span>{item}</span>{index < process.length - 1 && <Check size={15} />}</li>
					))}
				</ol>
			</Container>
		</section>
	);
}
