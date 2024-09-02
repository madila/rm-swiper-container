/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useInnerBlocksProps,
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';

import { __experimentalNumberControl as NumberControl, ToggleControl, Panel, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { DEFAULT_TEMPLATE, ALLOWED_BLOCKS } from './templates';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useLayoutEffect, useState, useRef } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';


/**
 * Render inspector controls for the Group block.
 *
 * @param {Object}   props                  Component props.
 * @param {string}   props.accentColor         The HTML tag name.
 * @param {Function} props.setAccentColor onChange function for the SelectControl.
 *
 * @return {JSX.Element}                The control group.
 */
function ColorGroupControl( { accentColor, setAccentColor } ) {
	return (
		<InspectorControls key="setting">
			<PanelColorSettings
				title={__('Accent color')}
				colorSettings={[
					{
						value: accentColor,
						onChange: setAccentColor,
						label: __('Accent color')
					},
				]}
			/>
		</InspectorControls>
	);
}

/**
 * Render inspector controls for the Group block.
 *
 * @param {Object}   props                  Component props.
 * @param {string}   props.maxWidth         The HTML tag name.
 * @param {Function} props.onMaxWidthChange onChange function for the SelectControl.
 *
 * @return {JSX.Element}                The control group.
 */
function SwiperControl( { slidesPerView, setSlidesPerView, setSpaceBetween, maxSlides, loop, setLoop , spaceBetween, setAutoPlay, autoPlay, speed, setSpeed} ) {
	return (
		<InspectorControls>
			<Panel header="Swiper Settings">
				<PanelBody title="Behaviour" initialOpen={ true }>
					<NumberControl
						help="Please select the slides per view. 0 for auto"
						isShiftStepEnabled={ true }
						shiftStep={ 1 }
						max={maxSlides}
						min={ 0 }
						labelPosition="top"
						value={ slidesPerView }
						label={ __( 'Slides per view (number)' ) }
						onChange={ setSlidesPerView }
					/>

					<UnitControl label={__('Space between slides')} onChange={ setSpaceBetween } value={ spaceBetween } />

					<ToggleControl
						label="Loop?"
						help={
							loop
								? 'Swiper will continue after the last slide.'
								: 'Swiper will stop at the last slide.'
						}
						checked={ loop }
						onChange={ setLoop }
					/>
					<ToggleControl
						label="Autoplay?"
						help={
							autoPlay
								? 'Swiper will start automatically'
								: 'Swiper will be manually controlled.'
						}
						checked={ autoPlay }
						onChange={ setAutoPlay }
					/>
					<NumberControl
						isShiftStepEnabled={ true }
						shiftStep={ 100 }
						max={20000}
						min={100}
						labelPosition="top"
						value={ speed }
						label={ __( 'Autoplay speed' ) }
						onChange={ setSpeed }
					/>
				</PanelBody>
			</Panel>
		</InspectorControls>
	);
}

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {WPElement} element
 * @param {number}    element.clientId
 * @param {Object}    element.attributes
 * @param {Function}  element.setAttributes
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( {clientId, attributes, setAttributes} ) {

	const {
		anchor,
		slidesPerView,
		accentColor,
		autoPlay,
		spaceBetween,
		speed,
		loop
	} = attributes;

	const [width, setWidth] = useState('auto');
	const swiper = useRef(null);


	// select and dispatch
	const { removeBlock } = useDispatch( 'core/block-editor' );
	const { blockCount } = useSelect( ( select ) => ( {
		blockCount: select( 'core/block-editor' ).getBlockCount( clientId ),
	} ) );

	const previousBlockCount = useRef( blockCount );

	useEffect( () => {
		if(!anchor) setAttributes( { anchor: clientId } );
	}, [] );

	let props = {
		'slides-per-view':  parseInt(slidesPerView) > 0 ? slidesPerView:  'auto',
		'autoplay': autoPlay,
		'space-between': spaceBetween,
		'speed': speed,
		...loop
	};

	const blockProps = useBlockProps(props);

	const { children, className, ...innerBlocksProps } = useInnerBlocksProps(
		blockProps,
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: DEFAULT_TEMPLATE,
			orientation: 'horizontal'
		}
	);

	useEffect( () => {

		if ( previousBlockCount.current > 0 && blockCount === 0 ) {
			removeBlock( clientId );
		}

		previousBlockCount.current = blockCount;

	}, [ blockCount, clientId, removeBlock ] );

	const resizeSwiperSlides = () => {
		if(swiper.current) {
			setWidth(`${swiper.current.getBoundingClientRect().width}px`);
		}
	}

	useLayoutEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				resizeSwiperSlides()
			}
		});
		resizeObserver.observe(swiper.current);
		return () => {
			resizeObserver.unobserve(swiper.current);
		};
	}, [swiper]);

	const swiperStyles = {
		'--width': width,
		'--slides': blockCount
	}

	return (
		<>
			<SwiperControl
				loop={loop}
				setLoop={(value) => {
					setAttributes({loop: value})
				}}
				autoPlay={autoPlay}
				setAutoPlay={(value) => {
					setAttributes({autoPlay: value})
				}}
				maxSlides={blockCount}
				slidesPerView={slidesPerView}
				setSlidesPerView={(value) =>
					setAttributes({slidesPerView: value})
				}
				spaceBetween={spaceBetween}
				setSpaceBetween={(value) =>
					setAttributes({spaceBetween: value})
				}
				speed={speed}
				setSpeed={(value) =>
					setAttributes({speed: value})
				}
			/>
			<ColorGroupControl
				accentColor={accentColor}
			   setAccentColor={(value) => {
				   setAttributes({accentColor: value});
			   }}/>
			<div ref={swiper} className={`${className} wp-block-rm-swiper-container`} style={swiperStyles}>
				<swiper-container {...innerBlocksProps }>
					{children}
				</swiper-container>
			</div>
		</>
	);
}
