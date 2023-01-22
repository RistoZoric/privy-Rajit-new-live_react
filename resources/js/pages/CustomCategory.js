import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  VStack,
  Box,
  Text,
  Stack,
  Link,
  HStack,
  Collapse,
  IconButton,
  Icon,
  Avatar,
  Image,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { Head, InertiaLink, usePage } from '@inertiajs/inertia-react';
import {
  FaStar,
} from 'react-icons/fa';
import CanelaText from '@/components/UI/CanelaText';
import Layout from '@/shared/Layout';

import Navigation from '@/components/UI/Navigation';
import Footer from '@/components/UI/Footer';

import { toggleMobileMenu, selectGlobal } from '@/slices/globalSlice';
import useRoutes from '@/utils/useRoutes';
import useLang from '@/utils/useLang';
import {Helmet} from 'react-helmet';
import '../../css/app_dev.css'

const PaginationButton = ({ link }) => (
  <Button
    as={InertiaLink}
    href={link.url || '#'}
    colorScheme={link.active ? 'glacier' : 'gray'}
    isDisabled={!link.url}
  >
    {link.label.replace('&laquo; ', '').replace('&raquo;', '')}
  </Button>
);

const CustomCategory = ({
  title, subtitle, categories, users,
}) => {
  const dispatch = useDispatch();
  const { isMobileMenuOpen } = useSelector(selectGlobal);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const route = useRoutes();
  const { locale } = usePage().props;
  const lang = useLang(locale);
  lang.setFallback("en");
  const toggleCategoriesOpen = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const renderCategoryNavigation = (category) => (
    <Link
      as={InertiaLink}
      href={route('categories.view', category.slug)}
      _hover={{ color: 'glacier.500', textDecoration: 'underline' }}
      key={category.id}
    >
      <Text fontSize="lg" fontWeight="medium">{category.name}</Text>
    </Link>
  );

  const renderUser = (user) => {
    const stars = [];
    const grayStars = [];

    for (let i = 0; i < user.rating; i++) {
      stars.push(<Icon as={FaStar} fontSize="md" color="#ffcc80" />);
    }

    for (let i = 0; i < (5 - user.rating); i++) {
      grayStars.push(<Icon as={FaStar} fontSize="md" color="gray.300" />);
    }

    return (
      <Box
        width="full"
        background="white"
        borderRadius="10px"
        boxShadow="sm"
        key={user.id}
      >
        <HStack spacing={4} align="center">
          <Link
            as={InertiaLink}
            href={route('users.view', user.username)}
          >
            <Avatar
              src={user.avatar}
              height="120px"
              width="100px"
              fit="cover"
              borderRadius="10px"
              background="glacier.300"
            />
          </Link>
          <Stack direction="column" spacing={4} p={4}>
            <VStack spacing={2} align="start">
              <Link
                as={InertiaLink}
                href={route('users.view', user.username)}
                fontSize="lg"
                fontWeight="semibold"
                _hover={{ color: 'glacier.500', textDecoration: 'underline' }}
              >
                {user.username}
              </Link>
              <HStack spacing={4}>
                <HStack spacing={2}>
                  {stars}
                  {grayStars}
                </HStack>
                <HStack spacing={2}>
                  <Text fontSize="sm">
                    {' '}
                    {user.received_reviews_count}
                    {' '}
                    reviews
                    {' '}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
            <HStack spacing={2}>
              <Text fontSize="xs">{user.category ? user.category.name : ''}</Text>
            </HStack>
          </Stack>
        </HStack>
      </Box>
    );
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={subtitle} />
      </Head>
      <Navigation
        isMobileMenuOpen={isMobileMenuOpen}
        onToggle={() => dispatch(toggleMobileMenu())}
        logo="gradient"
        textColor="glacier.500"
        btnScheme={{
          color: 'white',
          background: 'glacier.500',
        }}
        scheme="glacier"
        boxShadow="sm"
        navtype={2}
      />
      <VStack
        spacing={0}
      >
        <Box width="full" background="#fafafa">
          <Container
            maxWidth="8xl"
            px={{ base: 6, md: 12 }}
            py={{ base: 6, md: 12 }}
            className="mt-5"
          >
            <Stack width="full" direction="column" spacing={12} align="center" justify="center">
              <VStack spacing={1}>
                <CanelaText fontSize={{ base: '4xl', lg: '5xl' }} fontWeight="bold">
                  {title}
                </CanelaText>
                <Text fontSize={{ base: 'md', lg: 'lg' }} color="gray.500">
                  {subtitle}
                </Text>
              </VStack>
              <Stack
                width="full"
                direction={{ base: 'column', md: 'row' }}
                spacing={6}
                align="start"
                justify="center"
              >
                <Box
                  width={{ base: 'full', md: '30%' }}
                  background="white"
                  borderRadius={12}
                  boxShadow="sm"
                  p={10}
                >
                  <HStack align="center" justify="space-between">
                    <Text fontSize="xl" fontWeight="bold">{lang.get('categories.category')}</Text>
                    <IconButton
                      variant="ghost"
                      colorScheme="glacier"
                      size="lg"
                      icon={<Icon as={categoriesOpen ? IoChevronUp : IoChevronDown} />}
                      onClick={toggleCategoriesOpen}
                    />
                  </HStack>
                  <Collapse in={categoriesOpen} animateOpacity>
                    <VStack spacing={4} align="start" mt={6}>
                      {categories.map(renderCategoryNavigation)}
                    </VStack>
                  </Collapse>
                </Box>
                <Box width={{ base: 'full', md: '60%' }}>
                  <Box width={{
                    base: 'full', md: '100%', lg: '80%', xl: '70%',
                  }}
                  >
                    <VStack width="full" spacing={4} align="start">
                      {users.data.map(renderUser)}
                      {users.data.length && (
                        <ButtonGroup size="md" isAttached>
                          {users.meta.links.map((link) => <PaginationButton link={link} key={link.label} />)}
                        </ButtonGroup>
                      )}
                      {!users.data.length && (
                        <Box
                          width="full"
                          align="center"
                        >
                          <Image src="/images/no-results.svg" height="350px" width="auto" />
                          <Text fontSize="4xl" fontWeight="bold" mt={4} mb={2}>
                            {lang.get('categories.no_results.title')}
                          </Text>
                          <Text fontSize="lg" fontWeight="semibold" textAlign="center">
                            {lang.get('categories.no_results.body')}
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </Box>
                </Box>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </VStack>
      <Footer />
    </>
  );
};

CustomCategory.layout = (page) => <Layout children={page} />;

export default CustomCategory;
