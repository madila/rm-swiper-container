/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useEffect, useLayoutEffect, useState, useRef } from '@wordpress/element';

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
		slidesPerView,
		accentColor,
		speed,
		autoPlay,
		spaceBetween,
		loop
	} = attributes;


	let props = {
		'slides-per-view':  parseInt(slidesPerView) > 0 ? slidesPerView:  'auto',
		'autoplay': autoPlay,
		'space-between': spaceBetween,
		'speed': speed,
		'loop': loop,
	};

	const blockProps = useBlockProps.save(props);

	const { children, ...innerBlocksProps } = useInnerBlocksProps.save( blockProps );

	return (
		<swiper-container id={anchor} { ...innerBlocksProps }>
			{ children }
		</swiper-container>
	);
}
