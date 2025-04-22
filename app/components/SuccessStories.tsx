import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const successStories = [
  {
    title: "From Teacher to Tech Lead",
    content: "I transitioned from teaching to a tech lead role in just 6 months!",
  },
  {
    title: "Breaking Barriers in Engineering",
    content: "I became the first female engineer in my company, paving the way for others.",
  },
  // Add more stories as needed
];

export default function SuccessStories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {successStories.map((story, index) => (
        <Card 
          key={index} 
          className="bg-white hover:float long-press transition-transform duration-300"
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-800">{story.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{story.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 