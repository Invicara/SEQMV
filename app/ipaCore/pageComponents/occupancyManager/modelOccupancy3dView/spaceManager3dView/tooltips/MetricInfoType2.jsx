import React, { useCallback } from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		width: 'fit-content',
		paddingBottom: theme.spacing(1),
		flexWrap: "nowrap",
		// border: `1px solid ${theme.palette.divider}`,
		// borderRadius: theme.shape.borderRadius,
		// backgroundColor: theme.palette.background.paper,
		color: theme.palette.text.secondary
		// '& svg': {
		//    margin: theme.spacing(1.5),
		// },
		// '& hr': {
		//    margin: theme.spacing(0, 0.5),
		// },
	},
	metricContainer: {
		display: 'flex',
		alignItems: 'flex-start'
	},
	metricItem: {
		padding: `0px ${theme.spacing(1)}px`
	}
}))

export default function MetricInfoType2({ metrics }) {
	const classes = useStyles()

	const generateMetricSegment = useCallback((metric, index, metrics) => {
		const {
			value,
			unit,
			displayValue,
			maxOccupancyValue,
			label,
			icon,
			valueVariant = 'h6',
			unitVariant = 'subtitle1',
			color = 'success.main'
		} = metric
		let updatedValue =
			displayValue && displayValue != '-'
				? displayValue
				: value || displayValue
		updatedValue =
			typeof updatedValue === 'number'
				? Math.round(updatedValue).toLocaleString()
				: updatedValue
		return (
			<Grid key={index} item>
				<Box className={classes.metricContainer}>
					{icon && (
						<Box
							className={classes.metricItem}
							textAlign='left'
							style={{ alignSelf: 'center' }}
						>
							{icon}
						</Box>
					)}
					<Box className={classes.metricItem}>
						<Box
							style={{ display: 'flex', alignItems: 'baseline', textWrap: "nowrap" }}
						>
							<Typography
								variant={valueVariant}
								style={{ lineHeight: 1 }}
							>
								<Box textAlign='left' color='text.primary'>{updatedValue}</Box>
							</Typography>
						</Box>

						<Typography variant='caption'>
							<Box color={color} textAlign='left'>
								{label.label1}
							</Box>
						</Typography>
					</Box>
					<Box className={classes.metricItem}>
						<Box
							style={{ display: 'flex', alignItems: 'baseline', textWrap: "nowrap" }}
						>
							<Typography
								variant={valueVariant}
								style={{ lineHeight: 1 }}
							>
								<Box textAlign='left' color='text.primary'>{maxOccupancyValue}</Box>
							</Typography>
						</Box>

						<Typography variant='caption'>
							<Box color={color} textAlign='left'>
								{label.label2}
							</Box>
						</Typography>
					</Box>
					<Box className={classes.metricItem}>
						<Box
							style={{ display: 'flex', alignItems: 'baseline', textWrap: "nowrap" }}
						>
							<Typography
								variant={valueVariant}
								style={{ lineHeight: 1 }}
							>
								<Box textAlign='left' color='text.primary'>{maxOccupancyValue-updatedValue}</Box>
							</Typography>
						</Box>

						<Typography variant='caption'>
							<Box color={color} textAlign='left'>
								{label.label3}
							</Box>
						</Typography>
					</Box>
				</Box>
			</Grid>
		)
	}, [])

	return (
		<div>
			<Grid container alignItems='center' className={classes.root}>
				{metrics &&
					metrics.map((metric, index) => (
						<>
							{generateMetricSegment(metric, index, metrics)}
							{index < metrics.length - 1 && (
								<Divider flexItem orientation='vertical' />
							)}
						</>
					))}
			</Grid>
		</div>
	)
}
