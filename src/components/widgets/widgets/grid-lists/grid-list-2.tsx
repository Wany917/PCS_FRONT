"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { dayjs } from '@/lib/dayjs';

interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  location: string;
  type: string;
  author: { name: string; avatar?: string };
  currency: string;
  budget: number;
  rating: number;
  createdAt: Date;
}

const projects: Project[] = [
  {
    id: 'LG-001',
    title: 'Modern Apartment in City Center',
    description: 'A stylish and modern apartment located in the heart of the city.',
    images: [
      '/assets/apartment-city-center.jpg',
      '/assets/apartment-city-center-2.jpg',
      '/assets/apartment-city-center-3.jpg',
    ],
    location: 'Hotel de ville, Paris',
    type: 'Rent',
    author: { name: 'John Doe', avatar: '/assets/avatar-1.png' },
    currency: 'USD',
    budget: 3000,
    rating: 4.8,
    createdAt: dayjs().subtract(2, 'day').toDate(),
  },
  // Add other projects here
];

export function GridList2(): React.JSX.Element {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Box sx={{ bgcolor: 'var(--mui-palette-background-level1)', p: 3 }}>
      <Grid container spacing={3}>
        {isClient && projects.map((project) => (
          <Grid key={project.id} md={4} sm={6} xs={12}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps): React.JSX.Element {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.images.length);
  };

  const handlePrevImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + project.images.length) % project.images.length);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 10 }}
          onClick={handlePrevImage}
        >
          <NavigateBeforeIcon />
        </IconButton>
        <IconButton
          sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 10 }}
          onClick={handleNextImage}
        >
          <NavigateNextIcon />
        </IconButton>
        <CardMedia
          component="img"
          image={project.images[currentImageIndex]}
          sx={{ bgcolor: 'var(--mui-palette-background-level2)', height: '200px' }}
        />
      </Box>
      <Stack spacing={2} sx={{ flex: '1 1 auto', p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar src={project.author.avatar} />
          <div>
            <Typography color="text.primary" variant="subtitle1">
              {project.title}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              by{' '}
              <Typography color="text.primary" variant="subtitle2">
                {project.author.name}
              </Typography>{' '}
              | {dayjs(project.createdAt).fromNow()}
            </Typography>
          </div>
        </Stack>
        <Typography color="text.secondary" variant="body2">
          {project.description}
        </Typography>
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Typography variant="subtitle2">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: project.currency }).format(
                project.budget
              )}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Budget
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle2">{project.location}</Typography>
            <Typography color="text.secondary" variant="body2">
              Location
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle2">{project.type}</Typography>
            <Typography color="text.secondary" variant="body2">
              Type
            </Typography>
          </div>
        </Stack>
      </Stack>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', p: 2 }}>
        <Rating readOnly size="small" value={project.rating} />
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
        <Link href={`/${project.id}`} passHref>
          <Typography
            variant="button"
            sx={{ cursor: 'pointer', color: 'primary.main' }}
          >
            View Details
          </Typography>
        </Link>
      </Box>
    </Card>
  );
}
