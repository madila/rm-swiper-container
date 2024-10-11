/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {

	const {
		anchor,
		autoSlidesPerView,
		slidesPerView,
		accentColor,
		centeredSlides,
		speed,
		shouldOverflow,
		autoPlay,
		autoPlayDelay,
		spaceBetween,
		loop,
		pagination,
		navigation,
		scrollbar
	} = attributes;

	let props = {
		'slides-per-view': autoSlidesPerView ? 'auto' : slidesPerView,
		'should-overflow': shouldOverflow ? shouldOverflow.toString() : false,
		'speed': speed,
		'centered-slides': centeredSlides ? centeredSlides.toString() : false,
		'loop': loop,
	};

	if(spaceBetween) {
		props['space-between'] = spaceBetween;
	}

	if(autoPlay) {
		props['autoplay'] = 'true';
	}

	if(autoPlayDelay) {
		props['autoplay-delay'] = autoPlayDelay.toString() || '4000';
	}

	if(pagination) {
		props['pagination'] = 'true';
	}

	if(navigation) {
		props['navigation'] = 'true';
	}

	if(scrollbar) {
		props['scrollbar'] = 'true';
	}

	if(accentColor) {
		props.style = {
			...props.style,
			'--swiper-theme-color': accentColor,
		};
	}

	const blockProps = useBlockProps.save(props);

	const { children, ...innerBlocksProps } = useInnerBlocksProps.save( blockProps );
	return (
		<swiper-container id={anchor} { ...innerBlocksProps }>
			{ children }
		</swiper-container>
	);
}
