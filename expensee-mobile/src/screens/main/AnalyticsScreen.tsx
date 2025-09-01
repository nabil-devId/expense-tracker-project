import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {
  CartesianChart,
  Bar,
  Line,
  Pie,
  BarGroup,
  Area,
  useChartPressState,
} from 'victory-native';
import {analyticsService} from '../../api';
import {THEME} from '../../constants';
import Svg, {Circle, Path, G, Text as SvgText} from 'react-native-svg';

const {width} = Dimensions.get('window');

const AnalyticsScreen = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [period, setPeriod] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [merchantData, setMerchantData] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch category distribution
      const categoryDistribution =
        await analyticsService.getCategoryDistribution();
      setCategoryData(
        categoryDistribution.categories.map((item: any) => ({
          x: item.category.name,
          y: parseFloat(item.percentage),
          amount: item.amount,
          color: item.category.color || THEME.COLORS.PRIMARY,
        })),
      );

      // Fetch spending trends
      const trends = await analyticsService.getExpenseTrends({period});
      setTrendData(
        trends.data_points.map((point: any) => ({
          x: new Date(point.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          y: parseFloat(point.total_amount),
        })),
      );

      // Fetch merchant analysis
      const merchants = await analyticsService.getMerchantAnalysis({limit: 5});
      setMerchantData(
        merchants.top_merchants.map((merchant: any) => ({
          x: merchant.merchant_name,
          y: parseFloat(merchant.total_amount),
          percentage: merchant.percentage,
        })),
      );
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrencyFormat = (amount: number) => {
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
    });
  };

  const renderTimeSelector = () => {
    return (
      <View className="flex-row justify-around bg-light-surface rounded-lg p-1 mx-4 mb-4">
        <TouchableOpacity
          className={`px-4 py-2 rounded-md ${
            period === 'weekly' ? 'bg-primary' : ''
          }`}
          onPress={() => setPeriod('weekly')}>
          <Text
            className={
              period === 'weekly' ? 'text-white' : 'text-light-textSecondary'
            }>
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-md ${
            period === 'monthly' ? 'bg-primary' : ''
          }`}
          onPress={() => setPeriod('monthly')}>
          <Text
            className={
              period === 'monthly' ? 'text-white' : 'text-light-textSecondary'
            }>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTabSelector = () => {
    return (
      <View className="flex-row justify-around bg-light-surface p-4 border-b border-gray-200">
        <TouchableOpacity
          className={`px-4 py-2 ${
            activeTab === 'spending' ? 'border-b-2 border-primary' : ''
          }`}
          onPress={() => setActiveTab('spending')}>
          <Text
            className={
              activeTab === 'spending'
                ? 'text-primary font-bold'
                : 'text-light-textSecondary'
            }>
            Spending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 ${
            activeTab === 'categories' ? 'border-b-2 border-primary' : ''
          }`}
          onPress={() => setActiveTab('categories')}>
          <Text
            className={
              activeTab === 'categories'
                ? 'text-primary font-bold'
                : 'text-light-textSecondary'
            }>
            Categories
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          className={`px-4 py-2 ${
            activeTab === 'merchants' ? 'border-b-2 border-primary' : ''
          }`}
          onPress={() => setActiveTab('merchants')}>
          <Text
            className={
              activeTab === 'merchants'
                ? 'text-primary font-bold'
                : 'text-light-textSecondary'
            }>
            Merchants
          </Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  // Simple bar chart using direct SVG
  const SimpleBarChart = ({data, width, height, barColor}) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.y));
    const barWidth = (width - 40) / data.length - 10;

    return (
      <View style={{height: height, width: width}}>
        <Svg width={width} height={height}>
          {data.map((d, i) => {
            const barHeight = (d.y / maxValue) * (height - 50);
            return (
              <G key={i}>
                <Path
                  d={`M ${20 + i * (barWidth + 10)} ${
                    height - 30 - barHeight
                  } v ${barHeight} h ${barWidth} v ${-barHeight} z`}
                  fill={barColor}
                />
                <SvgText
                  x={20 + i * (barWidth + 10) + barWidth / 2}
                  y={height - 15}
                  fontSize="10"
                  textAnchor="middle"
                  fill="#636e72">
                  {d.x.substring(0, 3)}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
    );
  };

  // Simple pie chart using direct SVG
  const SimplePieChart = ({data, width, height}) => {
    if (!data || data.length === 0) return null;

    const radius = Math.min(width, height) / 2 - 40;
    const centerX = width / 2;
    const centerY = height / 2;

    let total = data.reduce((sum, d) => sum + d.y, 0);
    let startAngle = 0;

    return (
      <View style={{height: height, width: width}}>
        <Svg width={width} height={height}>
          <Circle cx={centerX} cy={centerY} r={radius / 2} fill="#f5f7fa" />
          {data.map((d, i) => {
            const percentage = d.y / total;
            const endAngle = startAngle + percentage * 2 * Math.PI;

            // Calculate the SVG path for the pie slice
            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            // Determine the large arc flag (1 for slices > 180 degrees)
            const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

            const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const slice = <Path key={i} d={pathData} fill={d.color} />;

            startAngle = endAngle;
            return slice;
          })}
        </Svg>
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
          <Text className="mt-4 text-light-textPrimary">
            Loading analytics data...
          </Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'spending':
        return (
          <View className="p-4">
            <Text className="text-xl font-bold text-light-textPrimary mb-4">
              Spending Over Time
            </Text>
            {trendData.length > 0 ? (
              <SimpleBarChart
                data={trendData}
                width={width - 40}
                height={300}
                barColor={THEME.COLORS.PRIMARY}
              />
            ) : (
              <View className="h-80 justify-center items-center">
                <Text className="text-light-textSecondary text-center">
                  No spending data available for this period
                </Text>
              </View>
            )}
          </View>
        );
      case 'categories':
        return (
          <View className="p-4">
            <Text className="text-xl font-bold text-light-textPrimary mb-4">
              Spending by Category
            </Text>
            {categoryData.length > 0 ? (
              <>
                <View className="items-center">
                  <SimplePieChart
                    data={categoryData}
                    width={width - 40}
                    height={300}
                  />
                </View>
                <View className="mt-4">
                  {categoryData.map((category: any, index: number) => (
                    <View
                      key={index}
                      className="flex-row items-center justify-between mb-3">
                      <View className="flex-row items-center">
                        <View
                          style={{backgroundColor: category.color}}
                          className="w-4 h-4 rounded-full mr-2"
                        />
                        <Text className="text-light-textPrimary">
                          {category.x}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text className="text-light-textPrimary mr-2">
                          {handleCurrencyFormat(parseFloat(category.amount))}
                        </Text>
                        <Text className="text-light-textSecondary text-sm">
                          ({category.y}%)
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <View className="h-80 justify-center items-center">
                <Text className="text-light-textSecondary text-center">
                  No category data available for this period
                </Text>
              </View>
            )}
          </View>
        );
      case 'merchants':
        return (
          <View className="p-4">
            <Text className="text-xl font-bold text-light-textPrimary mb-4">
              Top Merchants
            </Text>
            {merchantData.length > 0 ? (
              <View>
                {merchantData.map((merchant, index) => (
                  <View
                    key={index}
                    className="bg-light-surface rounded-lg p-4 mb-3 shadow-sm">
                    <View className="flex-row justify-between mb-1">
                      <Text className="font-bold text-light-textPrimary">
                        {merchant.x}
                      </Text>
                      <Text className="text-light-textPrimary">
                        {handleCurrencyFormat(merchant.y)}
                      </Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-full mt-2">
                      <View
                        className="h-2 bg-accent-blue rounded-full"
                        style={{width: `${merchant.percentage}%`}}
                      />
                    </View>
                    <Text className="text-xs text-light-textSecondary text-right mt-1">
                      {merchant.percentage}% of total spending
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="h-80 justify-center items-center">
                <Text className="text-light-textSecondary text-center">
                  No merchant data available for this period
                </Text>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-light-background">
      {/* {renderTabSelector()} */}
      <ScrollView className="p-4 mt-4">
        {renderTimeSelector()}
        {renderContent()}
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;
