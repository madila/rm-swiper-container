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
import { useEffect, useLayoutEffect, useRef, useState } from '@wordpress/element';

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
function SwiperControl( { maxSlides, attributes, setAttributes, selectedSlidesPerView, setSelectedSlidesPerView, useBreakpoints, setUseBreakpoints } ) {
	const {
		autoSlidesPerView,
		spaceBetween,
		pagination,
		navigation,
		scrollbar,
		speed,
		loop,
		autoPlay,
		autoPlayDelay,
		centeredSlides,
		shouldOverflow,
		slidesPerView,
		breakpoints,
	} = attributes;

	const units = [
		{ value: 'px', label: 'px', default: 0 }
	];

	const availableBreakpoints = [
		480, 768, 1024, 1440
	]

	const defaultBreakpoints = {
		480: { slidesPerView: slidesPerView || 'auto' },
		768: { slidesPerView: slidesPerView || 'auto' },
		1024: { slidesPerView: slidesPerView || 'auto' },
		1440: { slidesPerView: slidesPerView || 'auto' },
	}

	const breakpointsConfig = breakpoints ? JSON.parse(breakpoints) : defaultBreakpoints;

	return (
		<InspectorControls>
			<Panel header="Swiper Settings">
				<PanelBody title="Behaviour" initialOpen={ true }>

					<ToggleControl
						__nextHasNoMarginBottom
						label="Automatically calculate slides per view?"
						checked={ autoSlidesPerView }
						onChange={ (value) => {
							const currentSlides = slidesPerView === 'auto' ? 1 : slidesPerView;
							setAttributes({autoSlidesPerView: value});
							setSelectedSlidesPerView(currentSlides);
							setAttributes({slidesPerView: value ? 'auto' : selectedSlidesPerView});
						}}
					/>

					{!autoSlidesPerView &&
					<NumberControl
						help="Please select the slides per view. 0 for auto"
						isShiftStepEnabled={ true }
						shiftStep={ 1 }
						max={maxSlides}
						min={ 1 }
						labelPosition="top"
						value={ slidesPerView }
						label={ __( 'Slides per view (number)' ) }
						onChange={ (value) => {
							setSelectedSlidesPerView(value);
							if(!autoSlidesPerView) {
								setAttributes({slidesPerView: value})
							}
						}}
					/>}

					<ToggleControl
						__nextHasNoMarginBottom
						label="Use breakpoints?"
						help="Toggle this to set different slides per view per screen size"
						checked={ useBreakpoints }
						onChange={ (value) => {
							setUseBreakpoints(value);
						}}
					/>

					{useBreakpoints && availableBreakpoints.map((breakpoint, index) =>
						<NumberControl
							isShiftStepEnabled={ true }
							shiftStep={ 1 }
							max={maxSlides}
							min={ 1 }
							labelPosition="top"
							value={ breakpointsConfig.hasOwnProperty(breakpoint) ? breakpointsConfig[breakpoint].slidesPerView : 1 }
							label={ __( `Slides per view until ${breakpoint}px` ) }
							onChange={ (value) => {
								const newBreakpoints = {...breakpointsConfig}
								newBreakpoints[breakpoint] = {
									slidesPerView: value
								};
								setAttributes({
									breakpoints: JSON.stringify(newBreakpoints)
								})
							}}
						/>)}


					<ToggleControl
						__nextHasNoMarginBottom
						label="Loop?"
						help={
							loop
								? 'Swiper will continue after the last slide.'
								: 'Swiper will stop at the last slide.'
						}
						checked={ loop }
						onChange={ (value) =>
							setAttributes({loop: value})
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label="Autoplay?"
						help={
							autoPlay
								? 'Swiper will start automatically'
								: 'Swiper will be manually controlled.'
						}
						checked={ autoPlay }
						onChange={ (value) =>
							setAttributes({autoPlay: value})
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label="Overflow Visible"
						help={
							shouldOverflow
								? 'The content will be show outside of the container.'
								: 'The content will be hidden outside of the container.'
						}
						checked={ shouldOverflow }
						onChange={ (value) =>
							setAttributes({shouldOverflow: value}) }
					/>
					<UnitControl
						value={spaceBetween}
						units={units}
						onChange={ (value) =>
							setAttributes({spaceBetween: value}) }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label="Center Slides"
						checked={ centeredSlides }
						onChange={ (value) =>
							setAttributes({centeredSlides: value}) }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label="Enable navigation?"
						checked={ navigation }
						onChange={ (value) => {
							setAttributes({navigation: value});
						}}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label="Enable pagination?"
						checked={ pagination }
						onChange={ (value) => {
							setAttributes({pagination: value});
						}}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label="Enable scrollbars?"
						checked={ scrollbar }
						onChange={ (value) => {
							setAttributes({scrollbar: value});
						}}
					/>
					<NumberControl
						isShiftStepEnabled={ true }
						shiftStep={ 100 }
						max={20000}
						min={100}
						labelPosition="top"
						value={ autoPlayDelay }
						label={ __( 'Autoplay delay' ) }
						onChange={ (value) =>
							setAttributes({ autoPlayDelay: value })
						}
					/>
					<NumberControl
						isShiftStepEnabled={ true }
						shiftStep={ 100 }
						max={20000}
						min={100}
						labelPosition="top"
						value={ speed }
						label={ __( 'Autoplay transition speed' ) }
						onChange={ (value) =>
							setAttributes({speed: value})
						 }
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
 * @return {JSX.Element} Element to render.
 */
export default function Edit( {clientId, attributes, setAttributes} ) {

	const {
		spaceBetween,
		anchor,
		autoSlidesPerView,
		slidesPerView,
		accentColor,
		shouldOverflow,
		breakpoints
	} = attributes;

	const [useBreakpoints, setUseBreakpoints] = useState(breakpoints && breakpoints.length > 0);

	const [selectedSlidesPerView, setSelectedSlidesPerView] = useState(1);

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

	useEffect( () => {

		if(swiper.current) {

			if (previousBlockCount.current > 0 && blockCount === 0) {
				removeBlock(clientId);
			}

			previousBlockCount.current = blockCount;
		}

	}, [ blockCount, clientId, removeBlock ] );

	const blockProps = useBlockProps();

	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		blockProps,
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: DEFAULT_TEMPLATE,
			orientation: 'horizontal'
		}
	);

	useLayoutEffect( () => {
		if(swiper.current) {
			let frWidth;
			const {width} = swiper.current.getBoundingClientRect();
			if(useBreakpoints) {
				let perView = 1;
				const deviceWith = window.innerWidth;
				const breakpointsConfig = breakpoints ? JSON.parse(breakpoints) : {};
				const breakpointsKeys = Object.keys(breakpointsConfig);
				breakpointsKeys.forEach((value, index) => {
					if(Number(value) < deviceWith) {
						perView = breakpointsConfig[value].slidesPerView;
					}
				});
				frWidth = perView === 'auto' ? 1 : 1 / perView;
			} else {
				frWidth = slidesPerView === 'auto' ? 1 : 1 / slidesPerView;
			}

			swiper.current.style.setProperty('--space-between', spaceBetween);
			swiper.current.style.setProperty('--slides', blockCount);
			swiper.current.style.setProperty('--per-view', `${frWidth}fr`);
			swiper.current.style.setProperty('--slider-width', `${(width * frWidth) * blockCount}px`);
		}
	}, [ swiper, blockCount, useBreakpoints, breakpoints, spaceBetween, slidesPerView, autoSlidesPerView ] );

	return (
		<>
			<SwiperControl
				maxSlides={blockCount}
				attributes={attributes}
				setAttributes={setAttributes}
				selectedSlidesPerView={selectedSlidesPerView}
				setSelectedSlidesPerView={setSelectedSlidesPerView}
				useBreakpoints={useBreakpoints}
				setUseBreakpoints={setUseBreakpoints}
			/>
			<ColorGroupControl
				accentColor={accentColor}
			   setAccentColor={(value) => {
				   setAttributes({accentColor: value});
			   }}/>
			<div ref={swiper} className={`wp-block-rm-swiper-container__outer-wrapper${shouldOverflow ? ` should-overflow` : ``}`}>
				<div {...innerBlocksProps}>
					<div className="wp-block-rm-swiper-container__inner-wrapper">{children}</div>
				</div>
			</div>
		</>
	);
}

