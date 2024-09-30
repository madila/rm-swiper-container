/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType( metadata.name, {
	icon: {
		src: <svg width="100%" height="100%" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<circle cx="10.005" cy="16.666" r="0.713"/>
			<circle cx="12.422" cy="16.666" r="0.713"/>
			<circle cx="7.587" cy="16.666" r="0.713"/>
			<path
				d="M18.737,6.786L18.737,11.188C18.737,11.297 18.632,11.387 18.503,11.387L16.634,11.387C16.505,11.387 16.4,11.297 16.4,11.188L16.4,6.786C16.4,6.676 16.505,6.587 16.634,6.587L18.503,6.587C18.632,6.587 18.737,6.676 18.737,6.786Z"
				fill="none" strokeWidth="0.75" stroke="currentColor" />
			<path
				d="M3.421,6.79L3.421,11.183C3.421,11.295 3.315,11.387 3.184,11.387L1.289,11.387C1.158,11.387 1.051,11.295 1.051,11.183L1.051,6.79C1.051,6.678 1.158,6.587 1.289,6.587L3.184,6.587C3.315,6.587 3.421,6.678 3.421,6.79Z"
				fill="none" strokeWidth="0.75" stroke="currentColor" />
			<path
				d="M16.331,4.808L16.331,13.165C16.331,13.379 16.13,13.552 15.881,13.552L3.873,13.552C3.624,13.552 3.422,13.379 3.422,13.165L3.422,4.808C3.422,4.595 3.624,4.421 3.873,4.421L15.881,4.421C16.13,4.421 16.331,4.595 16.331,4.808Z"
				 fill="none" strokeWidth="0.75" stroke="currentColor"/>
		</svg>


	},
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
});
