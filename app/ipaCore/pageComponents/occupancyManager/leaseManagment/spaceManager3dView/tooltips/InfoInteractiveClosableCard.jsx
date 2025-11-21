import React from 'react'
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Divider } from '@mui/material';

const useStyles = props => makeStyles((theme) => ({
	root: {
		// maxWidth: 345,
		minWidth: 150,
		backdropFilter: 'blur(5px)'
	},
	headerRoot: {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(0.5)
	},
	title: {
		textDecoration: props.onTitleClick ? "underline" : undefined,
		cursor: props.onTitleClick ? "pointer" : undefined,
	},
	action: {
		marginTop: '-3px'
	},
	media: {
		height: 0,
		paddingTop: '56.25%' // 16:9
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(180deg)'
	},
	avatar: {
		backgroundColor: red[500]
	}
}))

export default function InfoInteractiveClosableCard({
	title,
	subheader,
	mediaComponent,
	contentComponent,
	expandedContentComponent,
	onClose,
	disableCardHeader,
	onCancel,
	onConfirm,
	onTitleClick
}) {
	const classes = useStyles({onTitleClick})()
	const [expanded, setExpanded] = React.useState(false)

	console.log('InfoInteractiveClosableCard', title)

	const handleExpandClick = () => {
		setExpanded(!expanded)
	}

	const handleClose = () => {
		onClose && onClose()
	}

	return (
		<Card classes={{ root: classes.root }}>
			{!disableCardHeader && (
				<CardHeader
					classes={{
						root: classes.headerRoot,
						action: classes.action,
						title: classes.title
					}}
					avatar={null}
					// action={
					// 	onClose ? (
					// 		<IconButton
					// 			size='small'
					// 			aria-label='close'
					// 			onClick={handleClose}
					// 		>
					// 			<CloseIcon />
					// 		</IconButton>
					// 	) : null
					// }
					title={title}
					titleTypographyProps={{ variant: 'subtitle1'}}
					subheader={subheader}
					subheaderTypographyProps={{variant: 'caption'}}
					// onClick={onTitleClick}
				/>
			)}
			<Divider component='hr' />
			{mediaComponent}
			{/* <CardMedia
                className={classes.media}
                image="/static/images/cards/paella.jpg"
                title="Paella dish"
            /> */}

			<CardContent>{contentComponent}</CardContent>

			{expandedContentComponent && (
				<div>
					<CardActions disableSpacing>
						<IconButton
							className={clsx(classes.expand, {
								[classes.expandOpen]: expanded
							})}
							onClick={handleExpandClick}
							aria-expanded={expanded}
							aria-label='show more'
						>
							<ExpandMoreIcon />
						</IconButton>
					</CardActions>
					<Collapse in={expanded} timeout='auto' unmountOnExit>
						<CardContent>{expandedContentComponent}</CardContent>
					</Collapse>
				</div>
			)}
			{(onCancel || onConfirm) && (
				<CardActions className={classes.actions}>
					{onCancel && (
						<Button
							color='primary'
							variant='outlined'
							size='large'
							onClick={onCancel}
						>
							{' '}
							Cancel{' '}
						</Button>
					)}
					{onConfirm && (
						<Button
							color='primary'
							variant='contained'
							size='large'
							onClick={onConfirm}
						>
							{' '}
							Confirm{' '}
						</Button>
					)}
				</CardActions>
			)}
		</Card>
	)
}
